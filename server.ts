
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import process from 'process';
import User from './models/User.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-low-security-secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Admin Security Sources (Environment Only)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@dishahire.com';
const ADMIN_PWD_HASH = process.env.ADMIN_PASSWORD_HASH || ''; 

// --- SECURITY MIDDLEWARE ---

app.use(helmet() as any);
app.use(cookieParser() as any);
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}) as any);
app.use(express.json({ limit: '10kb' }) as any);

// Anti-CSRF Guard
const csrfProtect = (req: any, res: any, next: any) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const customHeader = req.headers['x-requested-with'];
  if (customHeader !== 'XMLHttpRequest') {
    return res.status(403).json({ 
      error: 'Security violation: Unauthorized origin access.',
      code: 'CSRF_REJECTION'
    });
  }
  next();
};

app.use(csrfProtect as any);

const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Strict throttling for admin portal
  message: { error: 'Maximum authentication attempts exceeded. Access locked for 15 mins.', code: 'RATE_LIMIT_EXCEEDED' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  }
});

// --- JWT ENGINE ---

const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

const setAuthCookie = (res: any, token: string) => {
  res.cookie('__dh_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour session
  });
};

const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies['__dh_session'];
  if (!token) return res.status(401).json({ error: 'Session required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('__dh_session');
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
};

const authorize = (role: string) => (req: any, res: any, next: any) => {
  if (req.user?.role !== role) return res.status(403).json({ error: 'Access denied: Insufficient privileges.' });
  next();
};

// --- CORE ADMIN CONTROLLER ---

app.post('/api/admin/login', adminAuthLimiter, async (req, res) => {
  const { email, password } = req.body;
  const genericError = { error: 'Invalid administrative credentials provided.' };

  if (!email || !password || email !== ADMIN_EMAIL) {
    return res.status(401).json(genericError);
  }

  try {
    const isMatch = await bcrypt.compare(password, ADMIN_PWD_HASH);
    if (!isMatch) return res.status(401).json(genericError);

    const token = generateToken({ sub: 'master_admin', role: 'admin' });
    setAuthCookie(res, token);
    
    // Return virtual admin profile
    res.json({ 
      user: { 
        email: ADMIN_EMAIL, 
        role: 'admin', 
        name: 'System Administrator' 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal security engine error.' });
  }
});

// --- SHARED IDENTITY PROVIDER ---

app.get('/api/auth/me', authenticate, async (req: any, res) => {
  try {
    // ADMIN BYPASS: Return virtual profile without checking MongoDB
    if (req.user.role === 'admin') {
      return res.json({ 
        user: { 
          email: ADMIN_EMAIL, 
          role: 'admin', 
          name: 'System Administrator' 
        } 
      });
    }

    // USER FLOW: Check MongoDB
    const user = await User.findById(req.user.sub).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'Account no longer exists' });
    
    res.json({ user: { ...user.toObject(), role: 'user' } });
  } catch (err) {
    res.status(500).json({ error: 'Authentication service failure' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('__dh_session');
  res.json({ success: true });
});

// Fallback user routes (for completeness)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = generateToken({ sub: user._id, role: 'user' });
  setAuthCookie(res, token);
  res.json({ user: { id: user._id, name: user.name, email, role: 'user' } });
});

// Error handling
app.use((req, res) => res.status(404).json({ error: 'Resource not found' }));
app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({ error: 'An unexpected terminal error occurred.' });
});

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ DB Connected'));
}

app.listen(PORT, () => console.log(`🚀 Secure Production Admin Gateway on ${PORT}`));
