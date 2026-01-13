
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import process from 'process';

const app = express();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'dishahire-enterprise-secure-key-2025';

// Security & Middleware
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false 
}));

// Allow the specific frontend domain or localhost in dev
app.use(cors({
  origin: '*', // For production, replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '15mb' }));

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Enterprise Cluster'))
    .catch(err => console.error('❌ MongoDB Connection Failure:', err.message));
} else {
  console.warn('⚠️ MONGO_URI not found. Running in ephemeral mode.');
}

// Enterprise Data Models
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  industry: String,
  description: String,
  postedDate: { type: Date, default: Date.now }
});
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

const EnquirySchema = new mongoose.Schema({
  type: String,
  name: String,
  email: { type: String, index: true },
  subject: String,
  message: String,
  company: String,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});
const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH API ---

// Session Verification (Crucial for Frontend AuthContext)
app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Identity check failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    }
    res.status(401).json({ error: 'Invalid credentials provided.' });
  } catch (err) {
    res.status(500).json({ error: 'Login service unavailable.' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ error: 'Email already in use.' });
    
    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ name, email: email.toLowerCase().trim(), password: hashed });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: 'USER' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: 'USER' } });
  } catch (err) {
    res.status(500).json({ error: 'Account creation failed.' });
  }
});

// --- RESOURCES API ---

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedDate: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.get('/api/enquiries', async (req: any, res) => {
  try {
    const { email } = req.query;
    const filter = email ? { email: email.toLowerCase().trim() } : {};
    const enqs = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json(enqs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const enq = new Enquiry(req.body);
    await enq.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Submission failed.' });
  }
});

app.patch('/api/enquiries/:id/status', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  try {
    const enq = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(enq);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Health Check
app.get('/health', (req, res) => res.json({ status: 'active', timestamp: new Date() }));

app.listen(PORT, () => console.log(`🚀 DishaHire API listening on port ${PORT}`));
