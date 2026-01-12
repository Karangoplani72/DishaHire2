
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 10000; 
const JWT_SECRET = process.env.JWT_SECRET || 'dishahire-secure-default-key';

const corsOptions = {
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '25mb' })); 
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ CRITICAL ERROR: MONGO_URI environment variable is missing.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Success: Connected to MongoDB Atlas'))
    .catch(err => {
      console.error('❌ MongoDB Connection Failed:', err.message);
    });
}

const transform = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

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
  type: { type: String, enum: ['CANDIDATE', 'EMPLOYER'], required: true },
  subject: { type: String, default: 'General Inquiry' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  company: String,
  priority: { type: String, enum: ['NORMAL', 'HIGH'], default: 'NORMAL' },
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

const authenticateAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded: any = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'ADMIN') return res.status(403).json({ error: 'Admin privileges required' });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dishahire.0818@gmail.com';
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'DishaHire@Admin#2024';

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = jwt.sign({ email, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { email, name: 'Admin', role: 'ADMIN' } });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedDate: -1 });
    res.json(jobs);
  } catch(e) { res.status(500).json([]); }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const enq = new Enquiry(req.body);
    await enq.save();
    res.status(201).json({ message: 'Success' });
  } catch(e) { 
    console.error('Enquiry Error:', e);
    res.status(400).json({ error: 'Failed to process inquiry. Ensure all fields are valid.' }); 
  }
});

app.get('/api/my-applications', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const apps = await Enquiry.find({ email }).sort({ createdAt: -1 });
    res.json(apps);
  } catch(e) { res.status(500).json([]); }
});

app.post('/api/subscribers', async (req, res) => {
  try {
    const sub = new Subscriber(req.body);
    await sub.save();
    res.status(201).json({ message: 'Subscribed' });
  } catch(e) { res.status(400).json({ error: 'Already subscribed or invalid email.' }); }
});

app.get('/api/enquiries', authenticateAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch(e) { res.status(500).json([]); }
});

app.patch('/api/enquiries/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const enq = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(enq);
  } catch(e) { res.status(400).json({ error: 'Update failed' }); }
});

app.get('/api/subscribers', authenticateAdmin, async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch(e) { res.status(500).json([]); }
});

app.post('/api/jobs', authenticateAdmin, async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch(e) { res.status(400).json({ error: 'Job creation failed' }); }
});

app.delete('/api/jobs/:id', authenticateAdmin, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch(e) { res.status(400).json({ error: 'Delete failed' }); }
});

app.listen(PORT, () => console.log(`🚀 API active on port ${PORT}`));
