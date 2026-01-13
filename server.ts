import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'dishahire-enterprise-secure-key-2025';

// Security middleware
// Fix: Cast helmet middleware to any to resolve PathParams type mismatch
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false 
}) as any);
// Fix: Cast cors middleware to any to resolve PathParams type mismatch
app.use(cors() as any);
// Fix: Cast express.json middleware to any to resolve PathParams type mismatch
app.use(express.json({ limit: '15mb' }) as any);

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Enterprise Cluster'))
    .catch(err => console.error('❌ MongoDB Connection Failure:', err.message));
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
  email: String,
  subject: String,
  message: String,
  company: String,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});
const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

// Authentication API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Fix: Cast User model to any to resolve query filter 'email' typing issues
    const user = await (User as any).findOne({ email: email.toLowerCase().trim() });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    }
    res.status(401).json({ error: 'Invalid credentials provided for secure login.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Fix: Cast User model to any to resolve query filter 'email' typing issues
    const existing = await (User as any).findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ error: 'Identity already registered.' });
    
    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ name, email: email.toLowerCase().trim(), password: hashed });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: 'USER' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: 'USER' } });
  } catch (err) {
    res.status(500).json({ error: 'Account creation failed.' });
  }
});

// Resources API
app.get('/api/jobs', async (req, res) => {
  const jobs = await Job.find().sort({ postedDate: -1 });
  res.json(jobs);
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const enq = new Enquiry(req.body);
    await enq.save();
    res.json({ success: true, message: 'Inquiry successfully transmitted.' });
  } catch (err) {
    res.status(400).json({ error: 'Submission failed.' });
  }
});

// Static Assets Serving
// Fix: Cast express.static middleware to any to resolve PathParams type mismatch
app.use(express.static(__dirname) as any);

// Single Page Application Fallback
app.get('*', (req, res) => {
  if (req.url.startsWith('/api/')) return res.status(404).json({ error: 'API route not found' });
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 DishaHire Server actively listening on port ${PORT}`));