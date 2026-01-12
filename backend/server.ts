
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 10000; 
const JWT_SECRET = process.env.JWT_SECRET || 'dishahire-secure-enterprise-key';

const corsOptions = {
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '14mb' })); 

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ CRITICAL: MONGO_URI missing.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Standard: Connected to MongoDB Cluster'))
    .catch(err => console.error('❌ DB Connection Error:', err.message));
}

const transform = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  delete ret.password; // NEVER return password to frontend
};

// --- SCHEMAS ---

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true, trim: true },
  name: { type: String, required: true },
  password: { type: String }, // Hashed
  provider: { type: String, default: 'LOCAL' },
  picture: String,
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const OtpSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
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
  subject: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  company: String,
  status: { type: String, default: 'PENDING' },
  resumeData: String,
  resumeName: String,
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const User = mongoose.model('User', UserSchema);
const Otp = mongoose.model('Otp', OtpSchema);
const Job = mongoose.model('Job', JobSchema);
const Enquiry = mongoose.model('Enquiry', EnquirySchema);

// --- AUTH UTILS ---

const generateToken = (user: any) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// --- AUTH ROUTES ---

// Standard Password Login & Registration (Enterprise Standard)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Credentials missing' });

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dishahire.0818@gmail.com';
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  try {
    // 1. Check for Admin
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      if (!ADMIN_PASS || password !== ADMIN_PASS) {
        return res.status(401).json({ error: 'Invalid administrative access' });
      }
      const user = { _id: 'admin_id', email: ADMIN_EMAIL, name: 'DishaHire Admin', role: 'ADMIN' };
      return res.json({ token: generateToken(user), user });
    }

    // 2. Standard User Process
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Automatic secure registration for new users
      const hashedPassword = await bcrypt.hash(password, 12);
      user = new User({
        email: email.toLowerCase(),
        name: email.split('@')[0],
        password: hashedPassword,
        role: 'USER',
        provider: 'LOCAL'
      });
      await user.save();
    } else {
      // Validate existing user password
      if (!user.password) return res.status(400).json({ error: 'This account uses social login' });
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ error: 'Invalid password' });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({ token: generateToken(user), user });
  } catch (e) {
    res.status(500).json({ error: 'Internal Auth Error' });
  }
});

// Production Social Sync Logic
app.post('/api/auth/social-login', async (req, res) => {
  const { email, name, picture, provider } = req.body;
  if (!email) return res.status(400).json({ error: 'Identity missing' });

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        name,
        picture,
        provider: provider || 'GOOGLE',
        role: 'USER'
      });
    } else {
      user.name = name || user.name;
      user.picture = picture || user.picture;
      user.provider = provider || user.provider;
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({ token: generateToken(user), user });
  } catch (e) {
    res.status(500).json({ error: 'Social Sync Error' });
  }
});

// OTP Implementation (Mobile/Email 2FA Logic)
app.post('/api/auth/request-otp', async (req, res) => {
  const { identifier } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await Otp.deleteMany({ identifier });
    await new Otp({ identifier, code, expiresAt: new Date(Date.now() + 600000) }).save();
    console.log(`[VERIFY] Code for ${identifier}: ${code}`);
    res.json({ message: 'Code generated' });
  } catch (e) {
    res.status(500).json({ error: 'OTP failed' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { identifier, code, name } = req.body;
  try {
    const record = await Otp.findOne({ identifier, code, expiresAt: { $gt: new Date() } });
    if (!record) return res.status(400).json({ error: 'Expired or invalid code' });

    let user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) {
      user = new User({
        name: name || 'Professional User',
        email: identifier.includes('@') ? identifier.toLowerCase() : undefined,
        phone: !identifier.includes('@') ? identifier : undefined,
        role: 'USER',
        provider: 'OTP'
      });
      await user.save();
    }

    await Otp.deleteOne({ _id: record._id });
    res.json({ token: generateToken(user), user });
  } catch (e) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// --- CONTENT ROUTES (Public) ---
app.get('/api/jobs', async (req, res) => {
  const jobs = await Job.find().sort({ postedDate: -1 });
  res.json(jobs);
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const enq = new Enquiry(req.body);
    await enq.save();
    res.status(201).json({ message: 'Transmitted' });
  } catch (e) {
    res.status(400).json({ error: 'Data error' });
  }
});

app.listen(PORT, () => console.log(`🚀 Production Auth Hub active on ${PORT}`));
