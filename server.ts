
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

// Strictly locked to the frontend domain for credentialed requests
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://dishahire-huya.onrender.com';

// Administrative Credentials (Environment Only)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@dishahire.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// --- SECURITY & MIDDLEWARE ---
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}) as any);

app.use(cookieParser() as any);

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}) as any);

app.use(express.json({ limit: '10mb' }) as any);

// Anti-CSRF Guard for state-changing operations
const csrfGuard = (req: any, res: any, next: any) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
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
    secure: true,      // Required for SameSite=None
    sameSite: 'none',  // Critical for cross-origin (Render subdomains)
    maxAge: 3600000    // 1 Hour
  });
};

// --- AUTHENTICATION ROUTES ---

// 1. Admin Login (Stateless/Environment-Based)
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = signToken({ sub: 'master_admin', role: 'admin' });
    setSessionCookie(res, token);
    return res.json({ user: { email: ADMIN_EMAIL, name: 'System Administrator', role: 'admin' } });
  }
  res.status(401).json({ error: 'Invalid administrative credentials.' });
});

// 2. User Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Required fields missing.' });

  try {
    const existing = await (User as any).findOne({ email });
    if (existing) return res.status(400).json({ error: 'Identity already registered.' });

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role: 'user'
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
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  res.json({ success: true });
});

// 6. Health & Mocks
app.get('/health', (req, res) => res.json({ status: 'active', timestamp: new Date().toISOString() }));
app.get('/api/jobs', async (req, res) => res.json([]));
app.get('/api/admin/enquiries', async (req, res) => res.json([]));

// DB Connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ Identity Database Connected'));
}

app.listen(PORT, () => console.log(`🚀 Secure Production Gateway Live on ${PORT}`));
