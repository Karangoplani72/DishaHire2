
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://dishahire_admin:4rcl2bgesuvh3rzn@dishahire-cluster.fwxmlne.mongodb.net/dishahire?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to DishaHire MongoDB Cluster'))
  .catch(err => console.error('MongoDB connection error:', err));

// Helper to map MongoDB _id to id
const transform = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

// Schemas
const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
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
  priority: String,
  experience: String,
  role: String,
  resumeData: String,
  resumeName: String,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const NewsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now }
}, { toJSON: { transform }, toObject: { transform } });

const Job = mongoose.model('Job', JobSchema);
const Enquiry = mongoose.model('Enquiry', EnquirySchema);
const Newsletter = mongoose.model('Newsletter', NewsletterSchema);

// API Routes
app.get('/api/jobs', async (req, res) => {
  const jobs = await Job.find().sort({ postedDate: -1 });
  res.json(jobs);
});

app.post('/api/jobs', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create job' });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.get('/api/enquiries', async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json(enquiries);
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const enq = new Enquiry(req.body);
    await enq.save();
    res.status(201).json(enq);
  } catch (error) {
    res.status(400).json({ error: 'Failed to submit enquiry' });
  }
});

app.patch('/api/enquiries/:id', async (req, res) => {
  const enq = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(enq);
});

app.delete('/api/enquiries/:id', async (req, res) => {
  await Enquiry.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Newsletter Routes
app.post('/api/newsletter', async (req, res) => {
  try {
    const sub = new Newsletter(req.body);
    await sub.save();
    res.status(201).json(sub);
  } catch (error: any) {
    if (error.code === 11000) return res.status(200).json({ message: 'Already subscribed' });
    res.status(400).json({ error: 'Failed to subscribe' });
  }
});

app.get('/api/newsletter', async (req, res) => {
  const subs = await Newsletter.find().sort({ subscribedAt: -1 });
  res.json(subs);
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
