
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import process from 'process';

const app = express();
const PORT = process.env.PORT || 10000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://dishahire-huya.onrender.com';

// --- SCHEMAS ---
const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  industry: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Enquiry = (mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema)) as any;
const Job = (mongoose.models.Job || mongoose.model('Job', jobSchema)) as any;

// --- MIDDLEWARE ---
app.use(helmet() as any);
// Robust CORS to handle all potential Render frontend variants
app.use(cors({
  origin: [
    FRONTEND_URL, 
    'https://dishahire-huya.onrender.com', 
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'Authorization'],
  credentials: true
}) as any);
app.use(express.json() as any);

// --- AUTHENTICATION ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  console.log(`Login attempt for: ${email}`);

  if (email && password && email === adminEmail && password === adminPassword) {
    // Return a simple token based on JWT_SECRET if it exists, otherwise a secure string
    const token = process.env.JWT_SECRET 
      ? btoa(`${email}:${process.env.JWT_SECRET}:${Date.now()}`)
      : btoa(`${email}:${Date.now()}`);
      
    res.json({ 
      success: true, 
      token: token,
      message: 'Authentication Successful' 
    });
  } else {
    res.status(401).json({ error: 'Invalid corporate credentials. Access Denied.' });
  }
});

// --- PUBLIC ROUTES ---
app.get('/health', (req, res) => res.json({ 
  status: 'active', 
  service: 'DishaHire Core API', 
  db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' 
}));

// Enquiries
app.post('/api/enquiries', async (req, res) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    await newEnquiry.save();
    res.status(201).json({ success: true, id: newEnquiry._id });
  } catch (err) {
    console.error('Enquiry Error:', err);
    res.status(500).json({ error: 'Failed to process corporate enquiry' });
  }
});

// Jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to synchronize mandate database' });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const { title, company, location, industry, description } = req.body;
    if (!title || !company || !location || !industry || !description) {
      return res.status(400).json({ error: 'Missing required mandate attributes.' });
    }
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json({ success: true, mandate: newJob });
  } catch (err) {
    console.error('Job Creation Error:', err);
    res.status(500).json({ error: 'Failed to persist mandate.' });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const result = await Job.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Mandate not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retire mandate.' });
  }
});

// --- INITIALIZATION ---
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('💎 Enterprise Database Connected');
      app.listen(PORT, () => console.log(`🚀 DishaHire API active on port ${PORT}`));
    })
    .catch(err => {
      console.error('❌ DB Connection Error:', err);
      process.exit(1);
    });
} else {
  console.error('❌ FATAL: MONGO_URI is missing');
  process.exit(1);
}
