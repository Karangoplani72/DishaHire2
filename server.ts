
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
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false 
}) as any);

// Robust CORS for production
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}) as any);

app.use(express.json({ limit: '15mb' }) as any);

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
let dbConnected = false;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB Enterprise Cluster');
      dbConnected = true;
    })
    .catch(err => {
      console.error('❌ MongoDB Connection Failure:', err.message);
      dbConnected = false;
    });
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

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: dbConnected ? 'connected' : 'disconnected',
    time: new Date().toISOString()
  });
});

app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
  try {
    const user = await (User as any).findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Identity check failed' });
  }
});

// Authentication API
app.post('/api/auth/login', async (req, res) => {
  if (!dbConnected) return res.status(503).json({ error: 'Database service is currently unavailable.' });

  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const ADMIN_EMAIL = 'dishahire.0818@gmail.com';
    const ADMIN_PASS = process.env.ADMIN_PASSWORD;

    if (cleanEmail === ADMIN_EMAIL && ADMIN_PASS && password === ADMIN_PASS) {
      let adminUser = await (User as any).findOne({ email: cleanEmail });
      if (!adminUser) {
        adminUser = new User({ 
          name: 'DishaHire Admin', 
          email: cleanEmail, 
          password: await bcrypt.hash(password, 12),
          role: 'ADMIN' 
        });
        await adminUser.save();
      }
      const token = jwt.sign({ id: adminUser._id, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: adminUser._id, email: adminUser.email, name: adminUser.name, role: 'ADMIN' } });
    }

    const user = await (User as any).findOne({ email: cleanEmail });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    }
    res.status(401).json({ error: 'Invalid credentials provided for secure login.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await (mongoose.models.Job || mongoose.model('Job', new mongoose.Schema({}))).find().sort({ postedDate: -1 });
    res.json(jobs);
  } catch (e) {
    res.json([]);
  }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const EnquiryModel = mongoose.models.Enquiry || mongoose.model('Enquiry', new mongoose.Schema({}, { strict: false }));
    const enq = new EnquiryModel(req.body);
    await enq.save();
    res.json({ success: true, message: 'Inquiry successfully transmitted.' });
  } catch (err) {
    res.status(400).json({ error: 'Submission failed.' });
  }
});

// SPA Fallback
app.use(express.static(__dirname) as any);
app.get('*', (req, res) => {
  if (req.url.startsWith('/api/')) return res.status(404).json({ error: 'Endpoint not found' });
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 DishaHire Server actively listening on port ${PORT}`));
