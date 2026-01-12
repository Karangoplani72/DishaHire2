
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
const JWT_SECRET = process.env.JWT_SECRET || 'dishahire-enterprise-secret';

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.static(__dirname));

// DB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ CRITICAL: MONGO_URI is not defined in environment variables.');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Production MongoDB Connected'))
    .catch(err => console.error('❌ DB Connection Error:', err));
}

// --- CONSOLIDATED SCHEMAS ---
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now }
}));

const Job = mongoose.model('Job', new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  type: String,
  industry: String,
  description: String,
  postedDate: { type: Date, default: Date.now }
}));

const Enquiry = mongoose.model('Enquiry', new mongoose.Schema({
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

const Testimonial = mongoose.model('Testimonial', new mongoose.Schema({
  name: String,
  role: String,
  company: String,
  content: String,
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}));

const Blog = mongoose.model('Blog', new mongoose.Schema({
  title: String,
  excerpt: String,
  content: String,
  author: { type: String, default: 'DishaHire Editorial' },
  date: { type: Date, default: Date.now }
}));

const Subscriber = mongoose.model('Subscriber', new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now }
}));

// --- AUTH MIDDLEWARES ---
const authenticate = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || user.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Access denied or account suspended' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Session expired or invalid token' });
  }
};

const adminOnly = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
};

// --- ROUTES ---

/**
 * PRODUCTION AUTH LOGIC
 * Prioritizes the environment variable for Admin login.
 * If the admin user doesn't exist in DB, it creates it using the ENV password.
 */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Credentials required' });

  const inputEmail = email.toLowerCase().trim();
  const ADMIN_EMAIL = 'dishahire.0818@gmail.com';
  const ENV_ADMIN_PASS = process.env.ADMIN_PASSWORD;

  try {
    // 1. Check for Admin Hard-Login (via Environment Variable)
    if (inputEmail === ADMIN_EMAIL && ENV_ADMIN_PASS && password === ENV_ADMIN_PASS) {
      let admin = await User.findOne({ email: ADMIN_EMAIL, role: 'ADMIN' });
      
      if (!admin) {
        const hashed = await bcrypt.hash(ENV_ADMIN_PASS, 12);
        admin = new User({ 
          email: ADMIN_EMAIL, 
          name: 'DishaHire Admin', 
          password: hashed, 
          role: 'ADMIN',
          status: 'ACTIVE'
        });
        await admin.save();
      }
      
      const token = jwt.sign({ id: admin._id, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '10d' });
      return res.json({ token, user: admin });
    }

    // 2. Regular User / Existing Admin Fallback (via DB Hashed Password)
    const user = await User.findOne({ email: inputEmail });
    if (user && user.status === 'ACTIVE') {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '10d' });
        return res.json({ token, user });
      }
    }

    res.status(401).json({ error: 'Invalid professional credentials provided.' });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Internal security gateway failure.' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ error: 'Identity already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ 
      name, 
      email: email.toLowerCase().trim(), 
      password: hashed,
      role: 'USER'
    });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: 'USER' }, JWT_SECRET, { expiresIn: '10d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.get('/api/auth/me', authenticate, (req, res) => res.json({ user: req.user }));

// Public Data
app.get('/api/jobs', async (req, res) => res.json(await Job.find().sort({ postedDate: -1 })));
app.get('/api/blogs', async (req, res) => res.json(await Blog.find().sort({ date: -1 })));
app.get('/api/testimonials', async (req, res) => res.json(await Testimonial.find({ isApproved: true })));

// Forms
app.post('/api/enquiries', async (req, res) => res.json(await new Enquiry(req.body).save()));
app.post('/api/subscribers', async (req, res) => {
  try {
    const sub = new Subscriber({ email: req.body.email });
    await sub.save();
    res.json({ success: true });
  } catch (e) {
    res.json({ success: true, note: 'Already subscribed' });
  }
});

// Admin Managed Endpoints
app.get('/api/enquiries', authenticate, adminOnly, async (req, res) => {
  const { email } = req.query;
  const query = email ? { email: (email as string).toLowerCase().trim() } : {};
  res.json(await Enquiry.find(query).sort({ createdAt: -1 }));
});

app.patch('/api/enquiries/:id/status', authenticate, adminOnly, async (req, res) => {
  const { status } = req.body;
  const enq = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(enq);
});

app.post('/api/jobs', authenticate, adminOnly, async (req, res) => res.json(await new Job(req.body).save()));
app.delete('/api/jobs/:id', authenticate, adminOnly, async (req, res) => res.json(await Job.findByIdAndDelete(req.params.id)));
app.post('/api/blogs', authenticate, adminOnly, async (req, res) => res.json(await new Blog(req.body).save()));
app.delete('/api/blogs/:id', authenticate, adminOnly, async (req, res) => res.json(await Blog.findByIdAndDelete(req.params.id)));
app.get('/api/admin/testimonials', authenticate, adminOnly, async (req, res) => res.json(await Testimonial.find().sort({ createdAt: -1 })));
app.patch('/api/testimonials/:id', authenticate, adminOnly, async (req, res) => res.json(await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true })));

// SPA Routing
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`🚀 DishaHire Enterprise Server operational on port ${PORT}`));
