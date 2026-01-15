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

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);

// --- MIDDLEWARE ---
// Use casting to any to bypass strict type check issues with Express middleware versions
app.use(helmet() as any);
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With']
}) as any);
app.use(express.json() as any);

// --- PUBLIC ROUTES ---
app.get('/health', (req, res) => res.json({ status: 'active', timestamp: new Date().toISOString() }));

app.post('/api/enquiries', async (req, res) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    await newEnquiry.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal service failure' });
  }
});

// --- INITIALIZATION ---
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI).then(() => {
    app.listen(PORT, () => console.log(`🚀 Public API operational on port ${PORT}`));
  });
} else {
  console.error('❌ FATAL: MONGO_URI missing');
  process.exit(1);
}