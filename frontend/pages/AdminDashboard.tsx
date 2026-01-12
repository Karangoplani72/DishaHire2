
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Briefcase, MessageSquare, Plus, Trash2, Loader2 } from 'lucide-react';
import { Job, Enquiry } from '../types.ts';
import { db } from '../utils/db.ts';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('enquiries');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [j, e] = await Promise.all([db.getJobs(), db.getEnquiries()]);
    setJobs(j || []);
    setEnquiries(e || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-brand-dark text-white p-8 space-y-8">
        <div className="text-xl font-bold tracking-widest">DISHA ADMIN</div>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab('enquiries')} className={`w-full text-left p-3 rounded-lg ${activeTab === 'enquiries' ? 'bg-brand-gold text-brand-dark' : ''}`}>Inquiries</button>
          <button onClick={() => setActiveTab('jobs')} className={`w-full text-left p-3 rounded-lg ${activeTab === 'jobs' ? 'bg-brand-gold text-brand-dark' : ''}`}>Jobs</button>
        </nav>
      </div>
      <div className="flex-1 p-12">
        <h2 className="text-3xl font-serif font-bold mb-8 capitalize">{activeTab}</h2>
        {loading ? (
          <Loader2 className="animate-spin text-brand-gold" />
        ) : (
          <div className="space-y-4">
            {activeTab === 'jobs' && jobs.map(j => (
              <div key={j.id} className="bg-white p-6 rounded-xl border flex justify-between items-center">
                <span>{j.title} @ {j.company}</span>
                <button onClick={() => db.deleteJob(j.id).then(load)} className="text-red-500"><Trash2/></button>
              </div>
            ))}
            {activeTab === 'enquiries' && enquiries.map(e => (
              <div key={e.id} className="bg-white p-6 rounded-xl border">
                <div className="font-bold">{e.name} ({e.type})</div>
                <div className="text-sm text-gray-500">{e.email}</div>
                <div className="mt-2 text-gray-700">{e.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
