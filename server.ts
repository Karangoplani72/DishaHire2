
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
const JWT_SECRET = process.env.JWT_SECRET || 'dishahire-enterprise-secret-key-2024';

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// DB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ CRITICAL ERROR: MONGO_URI environment variable is missing.');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to DishaHire Production Database'))
    .catch(err => console.error('❌ Database Connection Failure:', err));
}

// --- SCHEMAS ---
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now }
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

const Blog = mongoose.models.Blog || mongoose.model('Blog', new mongoose.Schema({
  title: String,
  excerpt: String,
  content: String,
  author: { type: String, default: 'DishaHire Editorial' },
  date: { type: Date, default: Date.now }
}));

// --- AUTH HELPERS ---
const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Identity verification required' });
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.status !== 'ACTIVE') return res.status(403).json({ error: 'Access revoked' });
    req.user = user;
    next();
  } catch { res.status(401).json({ error: 'Session expired' }); }
};

const adminOnly = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin clearance required' });
  next();
};

// --- API ROUTES ---

// Public Auth Endpoints
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const inputEmail = email?.toLowerCase().trim();
  const ADMIN_EMAIL = 'dishahire.0818@gmail.com';
  const ENV_ADMIN_PASS = process.env.ADMIN_PASSWORD;

  try {
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

    const user = await User.findOne({ email: inputEmail });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user });
    }

    res.status(401).json({ error: 'Access denied. Invalid credentials.' });
  } catch (err) {
    res.status(500).json({ error: 'Security gateway error.' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ name, email: email.toLowerCase().trim(), password: hashed });
    await user.save();
    const token = jwt.sign({ id: user._id, role: 'USER' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch { res.status(400).json({ error: 'Registration failed or email exists.' }); }
});

app.get('/api/auth/me', authenticate, (req, res) => res.json({ user: req.user }));

// Public Content Endpoints
app.get('/api/jobs', async (req, res) => res.json(await Job.find().sort({ postedDate: -1 })));
app.get('/api/blogs', async (req, res) => res.json(await Blog.find().sort({ date: -1 })));
app.get('/api/testimonials', async (req, res) => {
  try {
    const approvedTestimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(approvedTestimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Enquiry Submission
app.post('/api/enquiries', async (req, res) => {
  try {
    const enq = new Enquiry(req.body);
    await enq.save();
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Submission failed' }); }
});

// Admin Control Panel
app.get('/api/enquiries', authenticate, adminOnly, async (req, res) => {
  const { email } = req.query;
  const filter = email ? { email: (email as string).toLowerCase().trim() } : {};
  res.json(await Enquiry.find(filter).sort({ createdAt: -1 }));
});

app.patch('/api/enquiries/:id/status', authenticate, adminOnly, async (req, res) => {
  const updated = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(updated);
});

app.post('/api/jobs', authenticate, adminOnly, async (req, res) => res.json(await new Job(req.body).save()));
app.delete('/api/jobs/:id', authenticate, adminOnly, async (req, res) => res.json(await Job.findByIdAndDelete(req.params.id)));
app.post('/api/blogs', authenticate, adminOnly, async (req, res) => res.json(await new Blog(req.body).save()));
app.get('/api/admin/testimonials', authenticate, adminOnly, async (req, res) => res.json(await Testimonial.find().sort({ createdAt: -1 })));
app.patch('/api/testimonials/:id', authenticate, adminOnly, async (req, res) => res.json(await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true })));

// --- STATIC FILES & SPA ROUTING ---
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  // Prevent catching API routes that were not handled
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 DishaHire Enterprise Server running on port ${PORT}`));
