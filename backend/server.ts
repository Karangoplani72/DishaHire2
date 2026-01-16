
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import process from 'process';

const app = express();
const PORT = process.env.PORT || 10000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://dishahire-huya.onrender.com';

// --- SCHEMAS ---
const companyEnquirySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  website: { type: String },
  address: { type: String },
  companyType: { type: String, required: true },
  contactName: { type: String, required: true },
  designation: { type: String },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  alternateNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const candidateEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  location: { type: String, required: true },
  dob: { type: String }, // Optional
  qualification: { type: String, required: true },
  passingYear: { type: String, required: true },
  currentTitle: { type: String }, // Optional
  preferredRole: { type: String, required: true },
  preferredIndustry: { type: String }, // Optional
  preferredLocation: { type: String }, // Optional
  currentSalary: { type: String }, // Optional
  expectedSalary: { type: String }, // Optional
  noticePeriod: { type: String }, // Optional
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

const CompanyEnquiry = mongoose.model('CompanyEnquiry', companyEnquirySchema);
const CandidateEnquiry = mongoose.model('CandidateEnquiry', candidateEnquirySchema);
const Job = mongoose.model('Job', jobSchema);

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
app.use(express.json({ limit: '5mb' }) as any);

// --- AUTHENTICATION ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email && password && email === adminEmail && password === adminPassword) {
    const token = btoa(`${email}:${Date.now()}`);
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Invalid credentials.' });
  }
});

// --- HELPER FOR DATE QUERY ---
const getDateQuery = (startDate?: any, endDate?: any) => {
  let query: any = {};
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate as string);
    if (endDate) {
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }
  return query;
};

// --- STATS ---
app.get('/api/admin/stats', async (req, res) => {
  try {
    const jobCount = await Job.countDocuments();
    const companyCount = await CompanyEnquiry.countDocuments();
    const candidateCount = await CandidateEnquiry.countDocuments();
    res.json({ jobCount, companyCount, candidateCount });
  } catch (err) {
    res.status(500).json({ error: 'Stats error' });
  }
});

// --- JOBS ---
app.get('/api/jobs', async (req, res) => {
  try {
    const { includeArchived, startDate, endDate } = req.query;
    let query = getDateQuery(startDate, endDate);
    if (includeArchived !== 'true') {
      query.isArchived = false;
    }
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Jobs fetch failed.' });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    res.status(500).json({ error: 'Job creation failed.' });
  }
});

app.patch('/api/jobs/:id/archive', async (req, res) => {
  try {
    const { isArchived } = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, { isArchived }, { new: true });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: 'Archive failed.' });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed.' });
  }
});

// --- ENQUIRIES ---
app.post('/api/enquiries/company', async (req, res) => {
  try {
    console.log('Receiving company enquiry:', req.body);
    const enquiry = new CompanyEnquiry(req.body);
    await enquiry.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Company Submission Error:", err);
    res.status(400).json({ error: 'Validation failed or database error.' });
  }
});

app.post('/api/enquiries/candidate', async (req, res) => {
  try {
    console.log('Receiving candidate enquiry:', req.body);
    const enquiry = new CandidateEnquiry(req.body);
    await enquiry.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Candidate Submission Error:", err);
    res.status(400).json({ error: 'Validation failed or database error.' });
  }
});

app.get('/api/admin/enquiries/company', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = getDateQuery(startDate, endDate);
    const data = await CompanyEnquiry.find(query).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Fetch failed.' }); }
});

app.get('/api/admin/enquiries/candidate', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = getDateQuery(startDate, endDate);
    const data = await CandidateEnquiry.find(query).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Fetch failed.' }); }
});

const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI).then(() => {
    app.listen(PORT, () => console.log(`🚀 DishaHire API active`));
  });
}
