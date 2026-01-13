
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import process from 'process';
import User from './models/User.ts';

const app = express();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'dh-production-secure-cipher-key';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Administrative Sourcing (Environment Variables)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@dishahire.com';
const ADMIN_PWD_HASH = process.env.ADMIN_PASSWORD_HASH; 

// --- SECURITY & MIDDLEWARE ---
// Fixed: Added 'as any' to helmet middleware to resolve type mismatch on line 22
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}) as any);
// Fixed: Added 'as any' to cookieParser middleware to prevent potential type errors
app.use(cookieParser() as any);
// Fixed: Added 'as any' to cors middleware to prevent potential type errors
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}) as any);
// Fixed: Added 'as any' to express.json middleware to resolve type mismatch on line 33
app.use(express.json({ limit: '10mb' }) as any);

// Anti-CSRF Guard for state-changing operations
const csrfGuard = (req: any, res: any, next: any) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  // Ensure the request is coming from our trusted frontend
  if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return res.status(403).json({ error: 'CSRF Protection Violation' });
  }
  next();
};
app.use(csrfGuard as any);

// --- JWT CORE ---
const signToken = (payload: object) => jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

const setSessionCookie = (res: any, token: string) => {
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000 // 1 Hour
  });
};

// --- AUTHENTICATION ROUTES ---

// 1. Admin Login (Stateless/Environment-Based)
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email !== ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Invalid administrative credentials.' });
  }

  try {
    const isMatch = ADMIN_PWD_HASH ? await bcrypt.compare(password, ADMIN_PWD_HASH) : false;
    // Emergency bypass for development if hash is missing
    const devBypass = !ADMIN_PWD_HASH && password === 'admin'; 

    if (!isMatch && !devBypass) {
      return res.status(401).json({ error: 'Invalid administrative credentials.' });
    }

    const token = signToken({ sub: 'master_admin', role: 'admin' });
    setSessionCookie(res, token);
    res.json({ user: { email: ADMIN_EMAIL, name: 'System Administrator', role: 'admin' } });
  } catch (err) {
    res.status(500).json({ error: 'Authentication engine failure.' });
  }
});

// 2. User Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields.' });

  try {
    const existing = await (User as any).findOne({ email });
    if (existing) return res.status(400).json({ error: 'Identity already registered.' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role: 'user',
      phoneNumber: 'Pending',
      city: 'Pending',
      state: 'Pending'
    });

    await newUser.save();
    const token = signToken({ sub: newUser._id, role: 'user' });
    setSessionCookie(res, token);
    res.status(201).json({ user: { id: newUser._id, name, email, role: 'user' } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. User Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await (User as any).findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = signToken({ sub: user._id, role: 'user' });
    setSessionCookie(res, token);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: 'user' } });
  } catch (err) {
    res.status(500).json({ error: 'Login service failure.' });
  }
});

// 4. Session Validation (Me)
app.get('/api/auth/me', async (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'No active session.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.role === 'admin') {
      return res.json({ user: { email: ADMIN_EMAIL, name: 'System Administrator', role: 'admin' } });
    }

    const user = await (User as any).findById(decoded.sub).select('-passwordHash');
    if (!user) {
      res.clearCookie('auth_token');
      return res.status(404).json({ error: 'Profile not found.' });
    }

    res.json({ user: { id: user._id, name: user.name, email: user.email, role: 'user' } });
  } catch (err) {
    res.clearCookie('auth_token');
    res.status(401).json({ error: 'Session expired or invalid.' });
  }
});

// 5. Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});

// Mock routes for requested verification
app.get('/api/jobs', async (req, res) => {
    res.json([]); // Minimal mock to prevent frontend errors
});

app.get('/api/admin/enquiries', async (req, res) => {
    res.json([]);
});

// Error Fallbacks
app.use((req, res) => res.status(404).json({ error: 'Resource path not found.' }));

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ Identity Database Connected'));
}

app.listen(PORT, () => console.log(`🚀 Production Auth Gateway Live on ${PORT}`));
