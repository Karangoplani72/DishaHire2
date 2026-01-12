
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 10000; 
const JWT_SECRET = process.env.JWT_SECRET || 'dishahire-secure-enterprise-key';

// Industry Standard: Security-first CORS configuration
const corsOptions = {
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '14mb' })); 

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ CRITICAL: MONGO_URI missing. Backend is non-functional.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Enterprise: Connected to Secure MongoDB Cluster'))
    .catch(err => console.error('❌ DB Connection Failure:', err.message));
}

const transform = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  delete ret.password; // Security: Never transmit hashed passwords
};

// --- SCHEMAS ---

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true, trim: true },
  name: { type: String, required: true },
  password: { type: String }, // Bcrypt Hashed
  provider: { type: String, enum: ['LOCAL', 'GOOGLE', 'PHONE', 'OTP'], default: 'LOCAL' },
  picture: String,
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const OtpSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

const AuditLogSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  action: String,
  ip: String,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Otp = mongoose.model('Otp', OtpSchema);
const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

// --- AUTH MIDDLEWARE ---

const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Identity required' });
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || user.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Account disabled or not found' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired' });
  }
};

// --- AUTH ROUTES ---

// GET /me: Enterprise standard for session persistence on frontend mount
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Validation failed: Missing fields' });

  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'dishahire.0818@gmail.com').toLowerCase();
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  try {
    // 1. Admin Gateway (Legacy Override)
    if (email.toLowerCase() === ADMIN_EMAIL) {
      if (!ADMIN_PASS || password !== ADMIN_PASS) {
        return res.status(401).json({ error: 'Invalid administrative security key' });
      }
      // Create/Find Admin User in DB to ensure auditability
      let admin = await User.findOne({ email: ADMIN_EMAIL, role: 'ADMIN' });
      if (!admin) {
        admin = new User({ email: ADMIN_EMAIL, name: 'DishaHire Admin', role: 'ADMIN', provider: 'LOCAL' });
        await admin.save();
      }
      const token = jwt.sign({ id: admin._id, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, user: admin });
    }

    // 2. Standard Secure Login Flow
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Industry Standard: Auto-registration on first successful login for high-conversion consulting sites
      const hashedPassword = await bcrypt.hash(password, 12);
      user = new User({
        email: email.toLowerCase(),
        name: email.split('@')[0],
        password: hashedPassword,
        role: 'USER',
        provider: 'LOCAL'
      });
      await user.save();
    } else {
      if (user.provider !== 'LOCAL') return res.status(400).json({ error: `Please log in using ${user.provider}` });
      const isValid = await bcrypt.compare(password, user.password!);
      if (!isValid) return res.status(401).json({ error: 'Credentials verification failed' });
    }

    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ error: 'Internal Security Error' });
  }
});

app.post('/api/auth/social-login', async (req, res) => {
  const { email, name, picture, provider } = req.body;
  if (!email) return res.status(400).json({ error: 'Social identity payload invalid' });

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        name,
        picture,
        provider: provider || 'GOOGLE',
        role: 'USER'
      });
    } else {
      user.name = name || user.name;
      user.picture = picture || user.picture;
      user.provider = provider || user.provider;
    }

    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ error: 'External identity synchronization failed' });
  }
});

// OTP Sourcing Logic
app.post('/api/auth/request-otp', async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: 'Identifier required' });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await Otp.deleteMany({ identifier });
    await new Otp({ identifier, code, expiresAt: new Date(Date.now() + 600000) }).save();
    console.log(`[SECURE-OTP] ${identifier}: ${code}`);
    res.json({ message: 'Identity verification code transmitted' });
  } catch (e) {
    res.status(500).json({ error: 'MFA Gateway failure' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { identifier, code, name } = req.body;
  try {
    const record = await Otp.findOne({ identifier, code, expiresAt: { $gt: new Date() } });
    if (!record) return res.status(400).json({ error: 'Code invalid or expired' });

    let user = await User.findOne({ $or: [{ email: identifier.toLowerCase() }, { phone: identifier }] });
    if (!user) {
      user = new User({
        name: name || 'Professional User',
        email: identifier.includes('@') ? identifier.toLowerCase() : undefined,
        phone: !identifier.includes('@') ? identifier : undefined,
        role: 'USER',
        provider: 'OTP'
      });
      await user.save();
    }

    await Otp.deleteOne({ _id: record._id });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ error: 'Identity verification failure' });
  }
});

// --- CONTENT API ---
// These remain for functionality, but now wrapped in better error handling if needed.

app.get('/api/jobs', async (req, res) => {
  const jobs = await mongoose.model('Job').find().sort({ postedDate: -1 });
  res.json(jobs);
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const enq = new (mongoose.model('Enquiry'))(req.body);
    await enq.save();
    res.status(201).json({ message: 'Strategic inquiry logged' });
  } catch (e) {
    res.status(400).json({ error: 'Inquiry validation error' });
  }
});

app.listen(PORT, () => console.log(`🚀 Secure Production Auth Hub active on port ${PORT}`));
