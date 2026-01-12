
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
const JWT_SECRET = process.env.JWT_SECRET || 'dishahire-enterprise-secret';
const ENV_ADMIN_PASS = process.env.ADMIN_PASSWORD;

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.static(__dirname));

// DB Connection
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ Production MongoDB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

// --- CONSOLIDATED SCHEMAS ---
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true, required: true },
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
  subject: String,
  message: String,
  company: String,
  priority: String,
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
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
}));

// Auth Middlewares
const authenticate = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Auth Required' });
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch { res.status(401).json({ error: 'Expired' }); }
};

const adminOnly = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
  next();
};

// --- ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = 'dishahire.0818@gmail.com';
  
  if (email === ADMIN_EMAIL && password === ENV_ADMIN_PASS) {
    let admin = await User.findOne({ email: ADMIN_EMAIL, role: 'ADMIN' });
    if (!admin) {
      const hashed = await bcrypt.hash(ENV_ADMIN_PASS!, 12);
      admin = new User({ email: ADMIN_EMAIL, name: 'Admin', password: hashed, role: 'ADMIN' });
      await admin.save();
    }
    const token = jwt.sign({ id: admin._id, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: admin });
  }

  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, role: 'USER' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  }
  res.status(401).json({ error: 'Invalid' });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 12);
  const user = new User({ name, email, password: hashed });
  await user.save();
  const token = jwt.sign({ id: user._id, role: 'USER' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

app.get('/api/auth/me', authenticate, (req, res) => res.json({ user: req.user }));

// Public Data
app.get('/api/jobs', async (req, res) => res.json(await Job.find().sort({ postedDate: -1 })));
app.get('/api/blogs', async (req, res) => res.json(await Blog.find().sort({ date: -1 })));
app.get('/api/testimonials', async (req, res) => res.json(await Testimonial.find({ isApproved: true })));

// Forms
app.post('/api/enquiries', async (req, res) => res.json(await new Enquiry(req.body).save()));
app.post('/api/subscribers', async (req, res) => res.json(await new Subscriber(req.body).save()));

// Admin Endpoints
app.get('/api/enquiries', authenticate, adminOnly, async (req, res) => res.json(await Enquiry.find().sort({ createdAt: -1 })));
app.post('/api/jobs', authenticate, adminOnly, async (req, res) => res.json(await new Job(req.body).save()));
app.delete('/api/jobs/:id', authenticate, adminOnly, async (req, res) => res.json(await Job.findByIdAndDelete(req.params.id)));
app.post('/api/blogs', authenticate, adminOnly, async (req, res) => res.json(await new Blog(req.body).save()));
app.get('/api/admin/testimonials', authenticate, adminOnly, async (req, res) => res.json(await Testimonial.find()));
app.patch('/api/testimonials/:id', authenticate, adminOnly, async (req, res) => res.json(await Testimonial.findByIdAndUpdate(req.params.id, req.body)));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, () => console.log(`🚀 DishaHire Server on ${PORT}`));
