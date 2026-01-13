
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
const JWT_SECRET = process.env.JWT_SECRET || 'dh-enterprise-2025-secure-key';
const ADMIN_EMAIL = 'dishahire.0818@gmail.com';

// Security Configuration
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false 
}) as any);

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}) as any);

app.use(express.json({ limit: '10mb' }) as any);

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
let dbConnected = false;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB Identity Provider Connected');
      dbConnected = true;
    })
    .catch(err => {
      console.error('❌ MongoDB Connection Failure:', err.message);
    });
}

// User Schema (MongoDB Only)
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// JWT Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Identity token required' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Session expired' });
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION API ---

// User Registration (MongoDB)
app.post('/api/auth/register', async (req, res) => {
  if (!dbConnected) return res.status(503).json({ error: 'Database offline' });
  try {
    const { name, email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    
    // Cast to any to resolve schema property detection issues
    const existing = await (User as any).findOne({ email: cleanEmail });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email: cleanEmail, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: 'user' } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login (MongoDB)
app.post('/api/auth/login', async (req, res) => {
  if (!dbConnected) return res.status(503).json({ error: 'Database offline' });
  try {
    const { email, password } = req.body;
    // Cast to any to resolve known properties error
    const user = await (User as any).findOne({ email: email.toLowerCase().trim() });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: 'user' } });
    }
    res.status(401).json({ error: 'Invalid user credentials' });
  } catch (err) {
    res.status(500).json({ error: 'Authentication service error' });
  }
});

// Admin Login (ENV Variable Based - No DB Query for Password)
app.post('/api/auth/admin-login', async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  if (email === ADMIN_EMAIL && ADMIN_PASS && password === ADMIN_PASS) {
    const token = jwt.sign({ id: 'static-admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { id: 'admin', email: ADMIN_EMAIL, name: 'System Admin', role: 'admin' } });
  }
  res.status(401).json({ error: 'Admin access denied: Incorrect master key' });
});

// Verify Session
app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
  if (req.user.role === 'admin') {
    return res.json({ user: { id: 'admin', email: ADMIN_EMAIL, name: 'System Admin', role: 'admin' } });
  }
  try {
    // Cast to any to resolve "not callable" error on findById
    const user = await (User as any).findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Session validation failed' });
  }
});

// --- RESOURCE API ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', database: dbConnected ? 'connected' : 'disconnected' });
});

app.get('/api/jobs', async (req, res) => {
  try {
    const JobModel = mongoose.models.Job || mongoose.model('Job', new mongoose.Schema({}, { strict: false }));
    // Cast to any to resolve "not callable" error on find
    const jobs = await (JobModel as any).find().sort({ postedDate: -1 });
    res.json(jobs || []);
  } catch (e) {
    res.json([]);
  }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const EnquiryModel = mongoose.models.Enquiry || mongoose.model('Enquiry', new mongoose.Schema({}, { strict: false }));
    const enq = new (EnquiryModel as any)(req.body);
    await enq.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Submission failed' });
  }
});

app.get('/api/enquiries', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') {
    // Users can only see their own enquiries
    // Cast to any to resolve "not callable" error
    const user = await (User as any).findById(req.user.id);
    const EnquiryModel = mongoose.models.Enquiry || mongoose.model('Enquiry', new mongoose.Schema({}, { strict: false }));
    // Cast to any to resolve known properties error on find
    const enqs = await (EnquiryModel as any).find({ email: user?.email }).sort({ createdAt: -1 });
    return res.json(enqs || []);
  }
  // Admins see everything
  const EnquiryModel = mongoose.models.Enquiry || mongoose.model('Enquiry', new mongoose.Schema({}, { strict: false }));
  // Cast to any for consistency
  const enqs = await (EnquiryModel as any).find().sort({ createdAt: -1 });
  res.json(enqs || []);
});

// SPA Setup
app.use(express.static(__dirname) as any);
app.get('*', (req, res) => {
  if (req.url.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 DishaHire Enterprise Server running on port ${PORT}`));
