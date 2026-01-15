
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
  education: { type: String, required: true },
  gender: { type: String, required: true },
  salary: { type: String, required: true },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  otherInfo: { type: String },
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Enquiry = (mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema)) as any;
const Job = (mongoose.models.Job || mongoose.model('Job', jobSchema)) as any;

// --- MIDDLEWARE ---
app.use(helmet() as any);
app.use(cors({
  origin: [
    FRONTEND_URL, 
    'https://dishahire-huya.onrender.com', 
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'Authorization'],
  credentials: true
}) as any);
app.use(express.json() as any);

// --- AUTHENTICATION ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email && password && email === adminEmail && password === adminPassword) {
    const token = btoa(`${email}:${Date.now()}`);
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Invalid corporate credentials.' });
  }
});

// --- PUBLIC ROUTES ---
app.get('/api/jobs', async (req, res) => {
  try {
    const { includeArchived } = req.query;
    const query = includeArchived === 'true' ? {} : { isArchived: false };
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync database.' });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job.' });
  }
});

app.patch('/api/jobs/:id/archive', async (req, res) => {
  try {
    const { isArchived } = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, { isArchived }, { new: true });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete.' });
  }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Enquiry failed.' });
  }
});

const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI).then(() => {
    app.listen(PORT, () => console.log(`🚀 DishaHire API active`));
  });
}
