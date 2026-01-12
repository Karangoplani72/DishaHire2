
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'dishahire-secure-enterprise-key-2024';

// Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(__dirname));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ CRITICAL: MONGO_URI missing.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to Secure MongoDB Atlas Cluster'))
    .catch(err => console.error('❌ MongoDB Connection Failed:', err.message));
}

// Transformation Helper
const transform = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  delete ret.password;
};

// --- SCHEMAS ---

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, default: 'Full-time' },
  industry: { type: String, required: true },
  description: { type: String, required: true },
  postedDate: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const EnquirySchema = new mongoose.Schema({
  type: { type: String, enum: ['CANDIDATE', 'EMPLOYER'] },
  subject: String,
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String, // Restored missing field
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

const User = mongoose.model('User', UserSchema);
const Job = mongoose.model('Job', JobSchema);
const Enquiry = mongoose.model('Enquiry', EnquirySchema);
const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

// --- AUTH MIDDLEWARE ---

const authenticate = async (req: any, res: any, next: any) => {
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

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: 'Identity already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email: email.toLowerCase(), password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '10d' });
    res.status(201).json({ token, user });
  } catch (e) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'dishahire.0818@gmail.com').toLowerCase();
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  try {
    if (email.toLowerCase() === ADMIN_EMAIL) {
      if (ADMIN_PASS && password !== ADMIN_PASS) return res.status(401).json({ error: 'Invalid admin key' });
      
      let admin = await User.findOne({ email: ADMIN_EMAIL, role: 'ADMIN' });
      if (!admin) {
        const hashedPassword = await bcrypt.hash(password, 12);
        admin = new User({ email: ADMIN_EMAIL, name: 'DishaHire Admin', password: hashedPassword, role: 'ADMIN' });
        await admin.save();
      }
      
      const token = jwt.sign({ id: admin._id, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '10d' });
      return res.json({ token, user: admin });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'Account not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '10d' });
    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ error: 'Login failure' });
  }
});

// --- DATA ROUTES ---

app.get('/api/jobs', async (req, res) => {
  const data = await Job.find().sort({ postedDate: -1 });
  res.json(data);
});

app.post('/api/jobs', authenticate, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin authorization required' });
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/jobs/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
  await Job.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.get('/api/enquiries', authenticate, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
  const data = await Enquiry.find().sort({ createdAt: -1 });
  res.json(data);
});

app.get('/api/my-applications', authenticate, async (req, res) => {
  const data = await Enquiry.find({ email: req.user.email }).sort({ createdAt: -1 });
  res.json(data);
});

app.post('/api/enquiries', async (req, res) => {
  const enq = new Enquiry(req.body);
  await enq.save();
  res.status(201).json(enq);
});

app.patch('/api/enquiries/:id/status', authenticate, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
  const enq = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(enq);
});

app.get('/api/subscribers', authenticate, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
  const data = await Subscriber.find().sort({ createdAt: -1 });
  res.json(data);
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

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 DishaHire Server Active on Port ${PORT}`));
