
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET;
const ENV_ADMIN_PASS = process.env.ADMIN_PASSWORD;

if (!JWT_SECRET || !ENV_ADMIN_PASS) {
  console.error("❌ SECURITY ALERT: JWT_SECRET or ADMIN_PASSWORD not set.");
  process.exit(1);
}

// --- MIDDLEWARE ---
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many login attempts." }
});

app.use(express.json({ limit: '5mb' }));
app.use(express.static(__dirname));

// --- MONGODB ---
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ Secure MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err.message));

// --- SCHEMAS ---
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' }
}));

const Job = mongoose.model('Job', new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  type: String,
  industry: String,
  description: String,
  postedDate: { type: Date, default: Date.now }
}));

const Enquiry = mongoose.model('Enquiry', new mongoose.Schema({
  type: { type: String, enum: ['CANDIDATE', 'EMPLOYER'] },
  name: String,
  email: String,
  message: String,
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
  rating: { type: Number, default: 5 },
  isApproved: { type: Boolean, default: false },
  adminReply: String,
  createdAt: { type: Date, default: Date.now }
}));

const Blog = mongoose.model('Blog', new mongoose.Schema({
  title: String,
  excerpt: String,
  content: String,
  author: { type: String, default: 'DishaHire Editorial' },
  date: { type: Date, default: Date.now }
}));

// --- MIDDLEWARES ---
const authenticate = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Auth required' });
  try {
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET!);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ error: 'Session expired' });
  }
};

const adminOnly = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
  next();
};

// --- ROUTES ---
app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'dishahire.0818@gmail.com').toLowerCase();
  
  if (email.toLowerCase() === ADMIN_EMAIL && password === ENV_ADMIN_PASS) {
    let admin = await User.findOne({ email: ADMIN_EMAIL, role: 'ADMIN' });
    if (!admin) {
      const hashed = await bcrypt.hash(ENV_ADMIN_PASS!, 12);
      admin = new User({ email: ADMIN_EMAIL, name: 'Admin', password: hashed, role: 'ADMIN' });
      await admin.save();
    }
    const token = jwt.sign({ id: admin._id, role: 'ADMIN' }, JWT_SECRET!, { expiresIn: '12h' });
    return res.json({ token, user: { name: admin.name, email: admin.email, role: 'ADMIN' } });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, role: 'USER' }, JWT_SECRET!, { expiresIn: '7d' });
    return res.json({ token, user: { name: user.name, email: user.email, role: 'USER' } });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 12);
  const user = new User({ name, email: email.toLowerCase(), password: hashed });
  await user.save();
  const token = jwt.sign({ id: user._id, role: 'USER' }, JWT_SECRET!, { expiresIn: '7d' });
  res.json({ token, user: { name, email, role: 'USER' } });
});

app.get('/api/auth/me', authenticate, (req, res) => res.json({ user: req.user }));

// JOBS
app.get('/api/jobs', async (req, res) => res.json(await Job.find().sort({ postedDate: -1 })));
app.post('/api/jobs', authenticate, adminOnly, async (req, res) => res.json(await new Job(req.body).save()));
app.delete('/api/jobs/:id', authenticate, adminOnly, async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ENQUIRIES
app.get('/api/enquiries', authenticate, adminOnly, async (req, res) => res.json(await Enquiry.find().sort({ createdAt: -1 })));
app.post('/api/enquiries', async (req, res) => res.json(await new Enquiry(req.body).save()));

// TESTIMONIALS
app.get('/api/testimonials', async (req, res) => res.json(await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 })));
app.get('/api/admin/testimonials', authenticate, adminOnly, async (req, res) => res.json(await Testimonial.find().sort({ createdAt: -1 })));
app.post('/api/testimonials', async (req, res) => res.json(await new Testimonial(req.body).save()));
app.patch('/api/testimonials/:id', authenticate, adminOnly, async (req, res) => {
  res.json(await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

// BLOGS
app.get('/api/blogs', async (req, res) => res.json(await Blog.find().sort({ date: -1 })));
app.post('/api/blogs', authenticate, adminOnly, async (req, res) => res.json(await new Blog(req.body).save()));
app.delete('/api/blogs/:id', authenticate, adminOnly, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, () => console.log(`🚀 DishaHire System Live on ${PORT}`));
