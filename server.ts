import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dishahire-secure-default-key';

// Middlewares
app.use(cors());
// Increased limit for high-resolution PDF resumes (base64 encoded)
app.use(express.json({ limit: '25mb' })); 
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve static files from the root directory (where bundled JS and index.html live)
app.use(express.static(__dirname));

// MongoDB Connection with robust error handling for production
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("CRITICAL ERROR: MONGO_URI is missing. Set it in Render Environment Variables.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas Cluster'))
    .catch(err => {
      console.error('❌ MongoDB Connection Failed:', err.message);
      // Fix: cast process to any to resolve 'exit' does not exist on type 'Process' in some build environments
      (process as any).exit(1); // Exit if DB connection fails in production
    });
}

// Transformation Helper for JSON responses
const transform = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

// Schemas
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  type: String,
  industry: String,
  description: String,
  postedDate: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const EnquirySchema = new mongoose.Schema({
  type: { type: String, enum: ['CANDIDATE', 'EMPLOYER'] },
  name: String,
  email: String,
  message: String,
  company: String,
  priority: { type: String, default: 'NORMAL' },
  experience: String,
  resumeData: String, // Storing base64 resume
  resumeName: String,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const Job = mongoose.model('Job', JobSchema);
const Enquiry = mongoose.model('Enquiry', EnquirySchema);
const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

// --- AUTH MIDDLEWARE ---
const authenticateAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Authentication required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Session expired or invalid token.' });
  }
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dishahire.0818@gmail.com';
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASS) {
    return res.status(500).json({ error: 'Server misconfiguration: Admin password not set.' });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = jwt.sign({ email, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { email, name: 'DishaHire Admin', role: 'ADMIN' } });
  }
  res.status(401).json({ error: 'Invalid administrative credentials.' });
});

// --- PUBLIC API ---
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedDate: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve job listings.' });
  }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const enq = new Enquiry(req.body);
    await enq.save();
    res.status(201).json({ message: 'Success: Your inquiry has been transmitted to our consultants.' });
  } catch (error) {
    console.error('Enquiry error:', error);
    res.status(400).json({ error: 'Transmission error. Please verify input data.' });
  }
});

app.post('/api/subscribers', async (req, res) => {
  try {
    const sub = new Subscriber(req.body);
    await sub.save();
    res.status(201).json({ message: 'Successfully subscribed to insights.' });
  } catch (error: any) {
    if (error.code === 11000) return res.status(200).json({ message: 'Already subscribed.' });
    res.status(400).json({ error: 'Subscription failed.' });
  }
});

// --- ADMIN PROTECTED API ---
app.post('/api/jobs', authenticateAdmin, async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: 'Invalid job data provided.' });
  }
});

app.delete('/api/jobs/:id', authenticateAdmin, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing permanently removed.' });
  } catch (err) {
    res.status(404).json({ error: 'Listing not found.' });
  }
});

app.get('/api/enquiries', authenticateAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch database records.' });
  }
});

app.get('/api/subscribers', authenticateAdmin, async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscriber list.' });
  }
});

// SPA FALLBACK: Critical for deep-linking in React (e.g., /jobs, /admin)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 DishaHire Professional Backend active on port ${PORT}`);
  console.log(`📡 Production Environment: ${process.env.NODE_ENV || 'development'}`);
});