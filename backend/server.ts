
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 10000; 
const JWT_SECRET = process.env.JWT_SECRET || 'dishahire-secure-default-key';

const corsOptions = {
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '14mb' })); 
app.use(express.urlencoded({ extended: true, limit: '14mb' }));

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ CRITICAL ERROR: MONGO_URI environment variable is missing.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Success: Connected to MongoDB Atlas'))
    .catch(err => {
      console.error('❌ MongoDB Connection Failed:', err.message);
    });
}

const transform = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

// --- SCHEMAS ---

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  password: { type: String }, // For email login
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const OtpSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // email or phone
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  type: String,
  industry: String,
  description: { type: String, required: true },
  postedDate: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const EnquirySchema = new mongoose.Schema({
  type: { type: String, enum: ['CANDIDATE', 'EMPLOYER'], required: true },
  subject: { type: String, default: 'General Inquiry' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  company: String,
  priority: { type: String, enum: ['NORMAL', 'HIGH'], default: 'NORMAL' },
  experience: String,
  resumeData: String,
  resumeName: String,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const User = mongoose.model('User', UserSchema);
const Otp = mongoose.model('Otp', OtpSchema);
const Job = mongoose.model('Job', JobSchema);
const Enquiry = mongoose.model('Enquiry', EnquirySchema);
const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

// --- AUTH HELPERS ---

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Auth required' });
  try {
    const decoded: any = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const authenticateAdmin = (req: any, res: any, next: any) => {
  authenticateToken(req, res, () => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
    next();
  });
};

// --- AUTH ROUTES ---

// Request OTP for Phone or Email (2FA)
app.post('/api/auth/request-otp', async (req, res) => {
  const { identifier } = req.body; // email or phone number
  if (!identifier) return res.status(400).json({ error: 'Identifier required' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60000); // 5 mins

  try {
    await Otp.deleteMany({ identifier }); // Clear old ones
    await new Otp({ identifier, code, expiresAt }).save();
    
    // SIMULATION: In production, use Twilio or Nodemailer here.
    console.log(`[AUTH] OTP for ${identifier}: ${code}`);
    
    res.json({ message: 'OTP transmitted successfully.' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to generate OTP.' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  const { identifier, code, name } = req.body;
  
  try {
    const record = await Otp.findOne({ identifier, code, expiresAt: { $gt: new Date() } });
    if (!record) return res.status(400).json({ error: 'Invalid or expired OTP.' });

    // Find or create user
    let user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) {
      user = new User({
        name: name || identifier.split('@')[0],
        email: identifier.includes('@') ? identifier : undefined,
        phone: !identifier.includes('@') ? identifier : undefined,
        role: 'USER'
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    await Otp.deleteOne({ _id: record._id });

    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ error: 'Verification failed.' });
  }
});

// Standard Email/Password Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dishahire.0818@gmail.com';
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  // Handle Admin
  if (email === ADMIN_EMAIL) {
    if (!ADMIN_PASS || password !== ADMIN_PASS) return res.status(401).json({ error: 'Invalid admin credentials' });
    const token = jwt.sign({ email, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { email, name: 'Admin', role: 'ADMIN' } });
  }

  // Handle Standard User (Simplified for demo: auto-registers with password if not found)
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name: email.split('@')[0], password, role: 'USER' });
      await user.save();
    } else if (user.password && user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- CONTENT ROUTES ---

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedDate: -1 });
    res.json(jobs);
  } catch(e) { res.status(500).json([]); }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const enq = new Enquiry(req.body);
    await enq.save();
    res.status(201).json({ message: 'Success' });
  } catch(e) { 
    console.error('Enquiry Error:', e);
    res.status(400).json({ error: 'Failed to process inquiry.' }); 
  }
});

app.get('/api/my-applications', authenticateToken, async (req, res) => {
  const { email } = req.query;
  // Use email from token if possible for security
  const targetEmail = email || req.user.email;
  if (!targetEmail) return res.status(400).json({ error: 'Email required' });
  
  try {
    const apps = await Enquiry.find({ email: targetEmail }).sort({ createdAt: -1 });
    res.json(apps);
  } catch(e) { res.status(500).json([]); }
});

app.post('/api/subscribers', async (req, res) => {
  try {
    const sub = new Subscriber(req.body);
    await sub.save();
    res.status(201).json({ message: 'Subscribed' });
  } catch(e: any) { 
    if (e.code === 11000) return res.status(200).json({ message: 'Already subscribed' });
    res.status(400).json({ error: 'Subscription failed.' }); 
  }
});

app.get('/api/enquiries', authenticateAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch(e) { res.status(500).json([]); }
});

app.patch('/api/enquiries/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const enq = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(enq);
  } catch(e) { res.status(400).json({ error: 'Update failed' }); }
});

app.get('/api/subscribers', authenticateAdmin, async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch(e) { res.status(500).json([]); }
});

app.post('/api/jobs', authenticateAdmin, async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch(e) { res.status(400).json({ error: 'Job creation failed' }); }
});

app.delete('/api/jobs/:id', authenticateAdmin, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch(e) { res.status(400).json({ error: 'Delete failed' }); }
});

app.listen(PORT, () => console.log(`🚀 API active on port ${PORT}`));
