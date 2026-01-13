
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

// Security Middlewares
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
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Cluster Connected'))
    .catch(err => console.error('❌ MongoDB Connection Failure:', err.message));
}

// --- RESOURCE API ---

app.get('/api/admin/enquiries', async (req, res) => {
  try {
    const EnquiryModel = mongoose.models.Enquiry || mongoose.model('Enquiry', new mongoose.Schema({}, { strict: false }));
    const enqs = await (EnquiryModel as any).find().sort({ createdAt: -1 });
    res.json(enqs || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

app.get('/api/admin/blogs', async (req, res) => {
  try {
    const BlogModel = mongoose.models.Blog || mongoose.model('Blog', new mongoose.Schema({}, { strict: false }));
    const blogs = await (BlogModel as any).find().sort({ date: -1 });
    res.json(blogs || []);
  } catch (err) {
    res.json([]);
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const JobModel = mongoose.models.Job || mongoose.model('Job', new mongoose.Schema({}, { strict: false }));
    await (JobModel as any).findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed' });
  }
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
    const enq = new (EnquiryModel as any)({
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    });
    await enq.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Inquiry submission failed' });
  }
});

// SPA Deployment
app.use(express.static(__dirname) as any);
app.get('*', (req, res) => {
  if (req.url.startsWith('/api/')) return res.status(404).json({ error: 'Endpoint unavailable' });
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 DishaHire Enterprise Gateway running on ${PORT}`));
