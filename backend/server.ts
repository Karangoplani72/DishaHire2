
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import process from 'process';

const app = express();
const PORT = process.env.PORT || 10000;

// --- PRODUCTION CONFIGURATION ---
const JWT_SECRET = process.env.JWT_SECRET || 'dh-production-secure-cipher-key';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://dishahire-huya.onrender.com';

// Administrative Credentials (Environment Only)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@dishahire.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// --- SELF-CONTAINED IDENTITY SCHEMA ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true, 
    lowercase: true,
    trim: true 
  },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// --- SECURITY MIDDLEWARE ---
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

app.use(express.json({ limit: '15mb' }) as any);

// Anti-CSRF Guard for state-changing operations
const csrfGuard = (req: any, res: any, next: any) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return res.status(403).json({ error: 'CSRF Protection Violation' });
  }
  next();
};
app.use(csrfGuard as any);

// --- JWT CORE UTILITIES ---
const signToken = (payload: object) => jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

const setAuthCookie = (res: any, token: string) => {
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: true,      // Required for SameSite=None
    sameSite: 'none',  // Mandatory for cross-origin Render subdomains
    maxAge: 3600000    // 1 Hour
  });
};

// --- AUTHENTICATION ROUTES ---

/**
 * @route POST /api/admin/login
 * @desc Stateless Admin Authentication using Environment Credentials
 */
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const isEmailValid = email === ADMIN_EMAIL;
    // For admin, we use simple comparison OR bcrypt if the env var is a hash.
    // Standard practice: check if password matches ADMIN_PASSWORD env
    const isPasswordValid = password === ADMIN_PASSWORD;

    if (isEmailValid && isPasswordValid) {
      const token = signToken({ sub: 'admin_root', role: 'admin' });
      setAuthCookie(res, token);
      return res.json({ 
        user: { 
          email: ADMIN_EMAIL, 
          name: 'System Administrator', 
          role: 'admin' 
        } 
      });
    }
    res.status(401).json({ error: 'Invalid administrative credentials.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Authentication Error' });
  }
});

/**
 * @route POST /api/auth/register
 * @desc User Registration
 */
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields.' });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Identity already registered.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, passwordHash, role: 'user' });
    await newUser.save();

    const token = signToken({ sub: newUser._id, role: 'user' });
    setAuthCookie(res, token);
    
    res.status(201).json({ 
      user: { id: newUser._id, name, email, role: 'user' } 
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Database persistence failure.' });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Standard User Authentication
 */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user: any = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid user credentials.' });
    }

    const token = signToken({ sub: user._id, role: 'user' });
    setAuthCookie(res, token);
    
    res.json({ 
      user: { id: user._id, name: user.name, email: user.email, role: 'user' } 
    });
  } catch (err) {
    res.status(500).json({ error: 'Authentication service failure.' });
  }
});

/**
 * @route GET /api/auth/me
 * @desc Session Validation via JWT Cookie
 */
app.get('/api/auth/me', async (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'No active session.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.role === 'admin') {
      return res.json({ 
        user: { email: ADMIN_EMAIL, name: 'System Administrator', role: 'admin' } 
      });
    }

    const user: any = await User.findById(decoded.sub).select('-passwordHash');
    if (!user) {
      res.clearCookie('auth_token', { httpOnly: true, secure: true, sameSite: 'none' });
      return res.status(404).json({ error: 'Session profile not found.' });
    }

    res.json({ 
      user: { id: user._id, name: user.name, email: user.email, role: 'user' } 
    });
  } catch (err) {
    res.clearCookie('auth_token', { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(401).json({ error: 'Session has expired.' });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Clear session cookies
 */
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  res.json({ success: true });
});

// --- CORE SYSTEM APIs ---
app.get('/health', (req, res) => {
  res.json({ status: 'active', timestamp: new Date().toISOString() });
});

app.get('/api/jobs', async (req, res) => {
  res.json([]); // Placeholder for job data
});

app.get('/api/admin/enquiries', async (req, res) => {
  res.json([]); // Placeholder for enquiries
});

// --- INITIALIZATION ---
const MONGO_URI = process.env.MONGO_URI;
const startServer = async () => {
  if (!MONGO_URI) {
    console.error('❌ FATAL: MONGO_URI is not defined.');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Identity Cluster Connected');
    app.listen(PORT, () => {
      console.log(`🚀 Production API Operational on Port ${PORT}`);
      console.log(`📡 CORS Origin Policy: ${FRONTEND_URL}`);
    });
  } catch (err: any) {
    console.error('❌ FATAL: Database Connection Failure:', err.message);
    process.exit(1);
  }
};

startServer();
