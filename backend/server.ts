
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

// Casting to any to handle potential Mongoose/TS versioning quirks in specific environments
const Enquiry = (mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema)) as any;
const Job = (mongoose.models.Job || mongoose.model('Job', jobSchema)) as any;

// --- MIDDLEWARE ---
app.use(helmet() as any);
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'Authorization']
}) as any);
app.use(express.json() as any);

// --- PUBLIC ROUTES ---
app.get('/health', (req, res) => res.json({ status: 'active', server: 'DishaHire-Node-Core', uptime: process.uptime() }));

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
    
    // Server-side validation check
    if (!title || !company || !location || !industry || !description) {
      return res.status(400).json({ error: 'All mandate attributes are required for executive entry.' });
    }

    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json({ success: true, mandate: newJob });
  } catch (err) {
    console.error('Job Creation Error:', err);
    res.status(500).json({ error: 'Failed to persist mandate to secure vault' });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const result = await Job.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Mandate not found in database' });
    res.json({ success: true, message: 'Mandate retired successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retire mandate from personnel vault' });
  }
});

// --- INITIALIZATION ---
// Strictly using MONGO_URI from environment variables as requested
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('💎 Enterprise Database Connected Successfully');
      app.listen(PORT, () => console.log(`🚀 DishaHire Public API operational on port ${PORT}`));
    })
    .catch(err => {
      console.error('❌ DATABASE CONNECTION FAILURE:', err);
      process.exit(1);
    });
} else {
  console.error('❌ FATAL: MONGO_URI environment variable is not defined in current execution context');
  process.exit(1);
}
