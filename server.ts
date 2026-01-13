
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

app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false 
}));
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// MongoDB with retry
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err.message));
} else {
  console.warn('⚠️ No MONGO_URI provided.');
}

// Models
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  status: { type: String, default: 'ACTIVE' }
}));

const Job = mongoose.models.Job || mongoose.model('Job', new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  industry: String,
  description: String,
  postedDate: { type: Date, default: Date.now }
}));

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', new mongoose.Schema({
  type: String,
  name: String,
  email: String,
  subject: String,
  message: String,
  company: String,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
}));

// API Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
    return res.json({ token, user });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 12);
  try {
    const user = new User({ name, email: email.toLowerCase().trim(), password: hashed });
    await user.save();
    const token = jwt.sign({ id: user._id, role: 'USER' }, JWT_SECRET);
    res.json({ token, user });
  } catch (e) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

app.get('/api/jobs', async (req, res) => res.json(await Job.find().sort({ postedDate: -1 })));
app.post('/api/enquiries', async (req, res) => {
  const enq = new Enquiry(req.body);
  await enq.save();
  res.json({ success: true });
});

// Serving Static
app.use(express.static(__dirname));

// Fallback for SPA
app.get('*', (req, res) => {
  if (req.url.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
