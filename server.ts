
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

// Security & Production Middleware
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false 
}));
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Mongoose Connection with retry logic
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.warn('⚠️ WARNING: MONGO_URI is missing. Database features will be unavailable.');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connectivity Established'))
    .catch(err => console.error('❌ MongoDB Connection Failure:', err.message));
}

// --- CONSOLIDATED MODELS ---
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const Job = mongoose.models.Job || mongoose.model('Job', new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  industry: String,
  description: String,
  postedDate: { type: Date, default: Date.now }
}));

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', new mongoose.Schema({
  type: { type: String, enum: ['CANDIDATE', 'EMPLOYER'] },
  name: String,
  email: { type: String, lowercase: true, trim: true },
  subject: String,
  message: String,
  company: String,
  priority: { type: String, default: 'NORMAL' },
  experience: String,
  resumeData: String,
  resumeName: String,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
}));

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', new mongoose.Schema({
  name: String,
  role: String,
  company: String,
  content: String,
  rating: { type: Number, default: 5 },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}));

// --- MIDDLEWARE ---
const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.status !== 'ACTIVE') return res.status(403).json({ error: 'Access denied' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Session expired' });
  }
};

const adminOnly = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin privileges required' });
  next();
};

// --- API ROUTES ---

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'operational', timestamp: new Date() }));

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const inputEmail = email?.toLowerCase().trim();
  const ADMIN_EMAIL = 'dishahire.0818@gmail.com';
  const ENV_ADMIN_PASS = process.env.ADMIN_PASSWORD;

  try {
    // Principal Admin Verification
    if (inputEmail === ADMIN_EMAIL && ENV_ADMIN_PASS && password === ENV_ADMIN_PASS) {
      let admin = await User.findOne({ email: ADMIN_EMAIL, role: 'ADMIN' });
      if (!admin) {
        const hashed = await bcrypt.hash(ENV_ADMIN_PASS, 12);
        admin = new User({ 
          email: ADMIN_EMAIL, 
          name: 'Principal Admin', 
          password: hashed, 
          role: 'ADMIN' 
        });
        await admin.save();
      }
      const token = jwt.sign({ id: admin._id, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: admin });
    }

    // Standard Identity Verification
    const user = await User.findOne({ email: inputEmail });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user });
    }

    res.status(401).json({ error: 'Invalid professional credentials.' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal security gateway error.' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' });
  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ error: 'Email already registered.' });

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ 
      name, 
      email: email.toLowerCase().trim(), 
      password: hashed,
      role: 'USER'
    });
    await user.save();
    const token = jwt.sign({ id: user._id, role: 'USER' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Strategic registration failure.' });
  }
});

app.get('/api/auth/me', authenticate, (req, res) => res.json({ user: req.user }));

// Content
app.get('/api/jobs', async (req, res) => res.json(await Job.find().sort({ postedDate: -1 })));
app.get('/api/testimonials', async (req, res) => res.json(await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 })));

app.post('/api/enquiries', async (req, res) => {
  try {
    const enq = new Enquiry(req.body);
    await enq.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Transmission failed.' });
  }
});

// Admin Panel
app.get('/api/enquiries', authenticate, adminOnly, async (req, res) => {
  const { email } = req.query;
  const filter = email ? { email: (email as string).toLowerCase().trim() } : {};
  res.json(await Enquiry.find(filter).sort({ createdAt: -1 }));
});

// Serving Static Files
app.use(express.static(__dirname));

// SPA Routing - All non-API routes serve index.html
app.get('*', (req, res) => {
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found.' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 DishaHire Operational on Port ${PORT}`));
