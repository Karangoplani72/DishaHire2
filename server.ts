
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Security Configuration
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false 
}) as any);

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}) as any);

app.use(express.json({ limit: '10mb' }) as any);

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
let dbConnected = false;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB Connected');
      dbConnected = true;
    })
    .catch(err => {
      console.error('❌ MongoDB Connection Failure:', err.message);
    });
}

// --- RESOURCE API ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', database: dbConnected ? 'connected' : 'disconnected' });
});

app.get('/api/jobs', async (req, res) => {
  try {
    const JobModel = mongoose.models.Job || mongoose.model('Job', new mongoose.Schema({}, { strict: false }));
    const jobs = await (JobModel as any).find().sort({ postedDate: -1 });
    res.json(jobs || []);
  } catch (e) {
    res.json([]);
  }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const EnquiryModel = mongoose.models.Enquiry || mongoose.model('Enquiry', new mongoose.Schema({}, { strict: false }));
    const enq = new (EnquiryModel as any)(req.body);
    await enq.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Submission failed' });
  }
});

app.get('/api/enquiries', async (req, res) => {
  try {
    const EnquiryModel = mongoose.models.Enquiry || mongoose.model('Enquiry', new mongoose.Schema({}, { strict: false }));
    const enqs = await (EnquiryModel as any).find().sort({ createdAt: -1 });
    res.json(enqs || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// SPA Setup
app.use(express.static(__dirname) as any);
app.get('*', (req, res) => {
  if (req.url.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 DishaHire Public Server running on port ${PORT}`));
