import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import process from 'process';

const app = express();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'dishahire-enterprise-secure-key-2025';

// Security & Middleware
// Fix: Cast helmet middleware to any to resolve PathParams type mismatch
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false 
}) as any);

// CORS configured for enterprise cross-origin communication
// Fix: Cast cors middleware to any if needed to maintain consistency and avoid potential typing errors
app.use(cors({
  origin: '*', // In strict production, replace with your specific frontend domain
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}) as any);

// Fix: Cast express.json middleware to any to resolve PathParams type mismatch
app.use(express.json({ limit: '15mb' }) as any);

// Database Connection with explicit error states
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('❌ CRITICAL: MONGO_URI environment variable is missing.');
    return;
  }
  
  try {
    // Masked URI for logging security
    const maskedUri = MONGO_URI.replace(/:([^@]+)@/, ':****@');
    console.log(`📡 Attempting connection to: ${maskedUri}`);
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast if DB is unreachable
    });
    console.log('✅ Connected to MongoDB Enterprise Cluster');
  } catch (err: any) {
    console.error('❌ MongoDB Connection Failure:', err.message);
    // Do not exit process, allow health check to report failure
  }
};

connectDB();

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
  
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Session expired or invalid' });
    req.user = user;
    next();
  });
};

// --- API ENDPOINTS ---

// Health Check (Used by Render for zero-downtime deploys)
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'active', 
    database: dbStatus,
    timestamp: new Date().toISOString() 
  });
});

app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
  try {
    // Fix: Cast User model to any to resolve "expression is not callable" union type error for findById
    const user = await (User as any).findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Identity not found' });
    res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Security context failure' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Credentials required' });

    // Fix: Cast User model to any to resolve query filter 'email' typing issues
    const user = await (User as any).findOne({ email: email.toLowerCase().trim() });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ 
        token, 
        user: { id: user._id, email: user.email, name: user.name, role: user.role } 
      });
    }
    res.status(401).json({ error: 'Invalid identity or access key.' });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Authentication service temporarily unavailable.' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are mandatory.' });

    // Fix: Cast User model to any to resolve query filter 'email' typing issues
    const existing = await (User as any).findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ error: 'This email is already registered.' });
    
    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ name, email: email.toLowerCase().trim(), password: hashed });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: 'USER' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: user._id, email: user.email, name: user.name, role: 'USER' } 
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'Could not create enterprise account.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`
  -----------------------------------------
  🚀 DISHAHIRE API LIVE
  📡 Port: ${PORT}
  🔐 Auth: JWT Enabled
  🛠️  Health: http://localhost:${PORT}/health
  -----------------------------------------
  `);
});