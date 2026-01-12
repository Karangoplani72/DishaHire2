
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 10000; 
const JWT_SECRET = process.env.JWT_SECRET || 'dishahire-secure-enterprise-key';

// Industry Standard: Security-first configuration
app.use(cors());
app.use(express.json({ limit: '14mb' })); 

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ CRITICAL: MONGO_URI missing.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Secure MongoDB Connection Established'))
    .catch(err => console.error('❌ DB Connection Failure:', err.message));
}

const transform = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  delete ret.password;
};

// --- CORE MODELS ---

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  type: String,
  industry: String,
  description: String,
  postedDate: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const EnquirySchema = new mongoose.Schema({
  type: { type: String, enum: ['CANDIDATE', 'EMPLOYER'] },
  subject: String,
  name: String,
  email: String,
  message: String,
  company: String,
  priority: { type: String, default: 'NORMAL' },
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

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true, trim: true },
  name: { type: String, required: true },
  password: { type: String },
  provider: { type: String, enum: ['LOCAL', 'PHONE', 'OTP'], default: 'LOCAL' },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const OtpSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

const Job = mongoose.model('Job', JobSchema);
const Enquiry = mongoose.model('Enquiry', EnquirySchema);
const Subscriber = mongoose.model('Subscriber', SubscriberSchema);
const User = mongoose.model('User', UserSchema);
const Otp = mongoose.model('Otp', OtpSchema);

// --- AUTH MIDDLEWARE ---

const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Identity required' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.status === 'SUSPENDED') return res.status(403).json({ error: 'Access denied' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired' });
  }
};

// --- AUTH ROUTES ---

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'dishahire.0818@gmail.com').toLowerCase();
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  try {
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASS) {
      let admin = await User.findOne({ email: ADMIN_EMAIL, role: 'ADMIN' });
      if (!admin) {
        admin = new User({ email: ADMIN_EMAIL, name: 'DishaHire Admin', role: 'ADMIN', provider: 'LOCAL' });
        await admin.save();
      }
      const token = jwt.sign({ id: admin._id, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '10d' });
      return res.json({ token, user: admin });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user = new User({ email: email.toLowerCase(), name: email.split('@')[0], password: hashedPassword, role: 'USER' });
      await user.save();
    } else {
      const isValid = await bcrypt.compare(password, user.password!);
      if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '10d' });
    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ error: 'Security failure' });
  }
});

// --- DATA ROUTES ---

app.get('/api/jobs', async (req, res) => {
  const jobs = await Job.find().sort({ postedDate: -1 });
  res.json(jobs);
});

app.post('/api/jobs', authenticateToken, async (req, res) => {
  const job = new Job(req.body);
  await job.save();
  res.status(201).json(job);
});

app.delete('/api/jobs/:id', authenticateToken, async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.get('/api/enquiries', authenticateToken, async (req, res) => {
  const enq = await Enquiry.find().sort({ createdAt: -1 });
  res.json(enq);
});

app.post('/api/enquiries', async (req, res) => {
  const enq = new Enquiry(req.body);
  await enq.save();
  res.status(201).json(enq);
});

app.patch('/api/enquiries/:id/status', authenticateToken, async (req, res) => {
  const enq = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(enq);
});

app.get('/api/subscribers', authenticateToken, async (req, res) => {
  const subs = await Subscriber.find().sort({ createdAt: -1 });
  res.json(subs);
});

app.post('/api/subscribers', async (req, res) => {
  try {
    const sub = new Subscriber(req.body);
    await sub.save();
    res.status(201).json(sub);
  } catch (e) {
    res.status(200).json({ message: 'Already active' });
  }
});

app.listen(PORT, () => console.log(`🚀 Production Server Ready on port ${PORT}`));
