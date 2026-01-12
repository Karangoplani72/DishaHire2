
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
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

// Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' })); 
app.use(express.static(__dirname)); // Serving current directory for browser-native ESM

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in environment variables.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas Production Cluster'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Transformation Helper
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
  resumeData: String,
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
  if (!authHeader) return res.status(401).json({ error: 'Access denied. No token provided.' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Session expired or invalid token.' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dishahire.0818@gmail.com';
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASS) {
    return res.status(500).json({ error: 'Server configuration error: Admin password not set.' });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = jwt.sign({ email, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '12h' });
    return res.json({ token, user: { email, name: 'DishaHire Admin', role: 'ADMIN' } });
  }
  res.status(401).json({ error: 'Invalid administrative credentials.' });
});

// --- PUBLIC ROUTES ---
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedDate: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings.' });
  }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const enq = new Enquiry(req.body);
    await enq.save();
    res.status(201).json({ message: 'Success' });
  } catch (error) {
    res.status(400).json({ error: 'Transmission failed. Please ensure file size is within limits.' });
  }
});

app.post('/api/subscribers', async (req, res) => {
  try {
    const sub = new Subscriber(req.body);
    await sub.save();
    res.status(201).json({ message: 'Subscribed successfully.' });
  } catch (error: any) {
    if (error.code === 11000) return res.status(200).json({ message: 'Already subscribed.' });
    res.status(400).json({ error: 'Subscription error.' });
  }
});

// --- PROTECTED ADMIN ROUTES ---
app.post('/api/jobs', authenticateAdmin, async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: 'Invalid job data.' });
  }
});

app.delete('/api/jobs/:id', authenticateAdmin, async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: 'Role removed from database.' });
});

app.get('/api/enquiries', authenticateAdmin, async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json(enquiries);
});

app.patch('/api/enquiries/:id', authenticateAdmin, async (req, res) => {
  const enq = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(enq);
});

app.get('/api/subscribers', authenticateAdmin, async (req, res) => {
  const subs = await Subscriber.find().sort({ createdAt: -1 });
  res.json(subs);
});

// SPA Fallback: Serve index.html for any unknown routes (Handles Client-side Routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DishaHire Production Server active on port ${PORT}`);
});
