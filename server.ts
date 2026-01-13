
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

// Enhanced CORS for production environments (Render/Vercel)
app.use(cors({
  origin: true, // Dynamically allow the origin of the request
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // Cache preflight response for 24 hours
}) as any);

app.use(express.json({ limit: '15mb' }) as any);

// Database Connection with retry logic
const MONGO_URI = process.env.MONGO_URI;
let dbConnected = false;

const connectWithRetry = () => {
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI is missing from environment variables.');
    return;
  }
  
  console.log('📡 Attempting MongoDB connection...');
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB Enterprise Cluster');
      dbConnected = true;
    })
    .catch(err => {
      console.error('❌ MongoDB Connection Failure:', err.message);
      dbConnected = false;
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Enterprise Data Models
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
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
  if (!token) return res.status(401).json({ error: 'Session required' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Session expired' });
    req.user = user;
    next();
  });
};

// --- API ENDPOINTS ---

// Health Check (Crucial for connectivity debugging)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: dbConnected ? 'connected' : 'disconnected',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production'
  });
});

app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
  try {
    const user = await (User as any).findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Identity not found' });
    res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Identity check failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  if (!dbConnected) return res.status(503).json({ error: 'The secure database is currently offline. Please retry in 30 seconds.' });

  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Credentials required' });
    
    const cleanEmail = email.toLowerCase().trim();
    const ADMIN_EMAIL = 'dishahire.0818@gmail.com';
    const ADMIN_PASS = process.env.ADMIN_PASSWORD;

    // Admin Override Logic
    if (cleanEmail === ADMIN_EMAIL && ADMIN_PASS && password === ADMIN_PASS) {
      let adminUser = await (User as any).findOne({ email: cleanEmail });
      if (!adminUser) {
        console.log('🔨 Bootstrapping Admin account...');
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

    // Standard User Path
    const user = await (User as any).findOne({ email: cleanEmail });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    }
    
    res.status(401).json({ error: 'The credentials provided do not match our secure records.' });
  } catch (err) {
    console.error('Login error details:', err);
    res.status(500).json({ error: 'Internal security service failure.' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  if (!dbConnected) return res.status(503).json({ error: 'Registration service is temporarily offline.' });
  
  try {
    const { name, email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const existing = await (User as any).findOne({ email: cleanEmail });
    if (existing) return res.status(400).json({ error: 'This identity is already registered in our network.' });
    
    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ name, email: cleanEmail, password: hashed });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: 'USER' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: 'USER' } });
  } catch (err) {
    res.status(500).json({ error: 'Account creation protocols failed.' });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const JobModel = mongoose.models.Job || mongoose.model('Job', new mongoose.Schema({}, { strict: false }));
    const jobs = await JobModel.find().sort({ postedDate: -1 });
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
    res.status(400).json({ error: 'Data transmission failed.' });
  }
});

// Serve Static Assets (Production)
app.use(express.static(__dirname) as any);

// SPA Fallback - Important for Routing
app.get('*', (req, res) => {
  if (req.url.startsWith('/api/')) return res.status(404).json({ error: 'Endpoint not discovered' });
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  🚀 DISHAHIRE SERVER ONLINE
  📡 Port: ${PORT}
  🔑 Admin Password: ${process.env.ADMIN_PASSWORD ? 'SET' : 'MISSING'}
  🔐 JWT Secret: ${process.env.JWT_SECRET ? 'SET' : 'DEFAULT'}
  `);
});
