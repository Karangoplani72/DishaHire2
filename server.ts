
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

// Admin Env Sources
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

// Anti-CSRF Middleware: Require custom header for all state-changing requests
const csrfProtect = (req: any, res: any, next: any) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const customHeader = req.headers['x-requested-with'];
  if (customHeader !== 'XMLHttpRequest') {
    return res.status(403).json({ error: 'Security violation: Invalid origin request' });
  }
  next();
};

app.use(csrfProtect as any);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Access restricted. Too many attempts.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- JWT HELPERS ---

const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

const setAuthCookie = (res: any, token: string) => {
  res.cookie('__dh_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  });
};

// Sliding Session & Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies['__dh_session'];
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;

    const now = Math.floor(Date.now() / 1000);
    const age = now - decoded.iat;
    if (age > 2700) { // Refresh after 45 mins of activity
      const newToken = generateToken({ sub: decoded.sub, role: decoded.role });
      setAuthCookie(res, newToken);
    }
    next();
  } catch (err) {
    res.clearCookie('__dh_session');
    return res.status(401).json({ error: 'Session expired' });
  }
};

const authorize = (role: string) => (req: any, res: any, next: any) => {
  if (req.user?.role !== role) return res.status(403).json({ error: 'Access denied' });
  next();
};

// --- AUTH ROUTES ---

app.post('/api/admin/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (email !== ADMIN_EMAIL) return res.status(401).json({ error: 'Invalid credentials' });
  
  const isMatch = await bcrypt.compare(password, ADMIN_PWD_HASH);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken({ sub: 'master_admin', role: 'admin' });
  setAuthCookie(res, token);
  res.json({ user: { email: ADMIN_EMAIL, role: 'admin', name: 'System Administrator' } });
});

app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phoneNumber, city, state } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords mismatch' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Identity already exists' });

    const salt = await bcrypt.getSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, passwordHash, phoneNumber, city, state });
    await user.save();

    const token = generateToken({ sub: user._id, role: 'user' });
    setAuthCookie(res, token);
    res.status(201).json({ user: { id: user._id, name, email, role: 'user' } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken({ sub: user._id, role: 'user' });
    setAuthCookie(res, token);
    res.json({ user: { id: user._id, name: user.name, email, role: 'user' } });
  } catch (err) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// PASSWORD RESET FLOW
app.post('/api/auth/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If an account exists, a reset link has been sent.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // In production, send email here. Logging for system visibility:
    console.log(`[AUTH] Reset Token for ${email}: ${resetToken}`);
    res.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Request failed' });
  }
});

app.post('/api/auth/reset-password', authLimiter, async (req, res) => {
  const { token, password } = req.body;
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: 'Token invalid or expired' });

    const salt = await bcrypt.getSalt(12);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Reset failed' });
  }
});

app.get('/api/auth/me', authenticate, async (req: any, res) => {
  if (req.user.role === 'admin') {
    return res.json({ user: { email: ADMIN_EMAIL, role: 'admin', name: 'Admin' } });
  }
  const user = await User.findById(req.user.sub).select('-passwordHash');
  res.json({ user: { ...user.toObject(), role: 'user' } });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('__dh_session');
  res.json({ success: true });
});

// --- PROTECTED RESOURCES ---
app.get('/api/admin/enquiries', authenticate, authorize('admin'), async (req, res) => {
  const Enquiry = mongoose.model('Enquiry', new mongoose.Schema({}, { strict: false }));
  res.json(await Enquiry.find().sort({ createdAt: -1 }));
});

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ DB Secure & Health Check Pass'));
}

app.listen(PORT, () => console.log(`🚀 Secure Production Gateway on ${PORT}`));
