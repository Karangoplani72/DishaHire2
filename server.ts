
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
const JWT_SECRET = process.env.JWT_SECRET || 'dh_secure_enterprise_prod_2024_k8s_cluster_key';

// --- PRODUCTION MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// --- MONGODB CONNECTION ---
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ CRITICAL: MONGO_URI environment variable is missing.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Production Database Connected'))
    .catch(err => console.error('❌ DB Connection Error:', err.message));
}

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  createdAt: { type: Date, default: Date.now }
});

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  type: { type: String, default: 'Full-time' },
  industry: String,
  description: String,
  postedDate: { type: Date, default: Date.now }
});

const EnquirySchema = new mongoose.Schema({
  type: { type: String, enum: ['CANDIDATE', 'EMPLOYER'], required: true },
  name: String,
  email: String,
  message: String,
  resumeData: String,
  resumeName: String,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Job = mongoose.model('Job', JobSchema);
const Enquiry = mongoose.model('Enquiry', EnquirySchema);
const Subscriber = mongoose.model('Subscriber', new mongoose.Schema({ email: String, createdAt: { type: Date, default: Date.now } }));

// --- SECURITY MIDDLEWARES ---

const authenticate = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Session required' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ error: 'Identity revoked' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired' });
  }
};

const adminOnly = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Privileged access required' });
  next();
};

// --- AUTH ROUTES ---

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: 'Account already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email: email.toLowerCase(), password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, role: 'USER' }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name, email, role: 'USER' } });
  } catch (e) {
    res.status(500).json({ error: 'Account creation failure' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const ENV_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'dishahire.0818@gmail.com').toLowerCase();
  const ENV_ADMIN_PASS = process.env.ADMIN_PASSWORD;

  try {
    // 1. Check for Fixed Admin from Environment Variables
    if (email.toLowerCase() === ENV_ADMIN_EMAIL && ENV_ADMIN_PASS && password === ENV_ADMIN_PASS) {
      let admin = await User.findOne({ email: ENV_ADMIN_EMAIL, role: 'ADMIN' });
      if (!admin) {
        const hashedPassword = await bcrypt.hash(password, 12);
        admin = new User({ email: ENV_ADMIN_EMAIL, name: 'DishaHire Master', password: hashedPassword, role: 'ADMIN' });
        await admin.save();
      }
      const token = jwt.sign({ id: admin._id, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '12h' });
      return res.json({ token, user: { id: admin._id, name: admin.name, email: admin.email, role: 'ADMIN' } });
    }

    // 2. Regular User Login
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: 'Security bridge failure' });
  }
});

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// --- PROTECTED DATA ROUTES ---

app.get('/api/jobs', async (req, res) => {
  const data = await Job.find().sort({ postedDate: -1 });
  res.json(data);
});

app.post('/api/jobs', authenticate, adminOnly, async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (e) {
    res.status(400).json({ error: 'Validation failed' });
  }
});

app.delete('/api/jobs/:id', authenticate, adminOnly, async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.get('/api/enquiries', authenticate, adminOnly, async (req, res) => {
  const data = await Enquiry.find().sort({ createdAt: -1 });
  res.json(data);
});

app.post('/api/enquiries', async (req, res) => {
  const enq = new Enquiry(req.body);
  await enq.save();
  res.status(201).json({ success: true });
});

// SPA FALLBACK
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Production Hub running on Port ${PORT}`));
