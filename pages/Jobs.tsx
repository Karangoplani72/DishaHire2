
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, Filter, ChevronRight, X, FileText, AlertCircle, Shield, Loader2, Send } from 'lucide-react';
import { Job } from '../types';
import { db } from '../utils/db.ts';

const Jobs: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await db.getJobs();
      setJobs(data || []);
    } catch (error) {
      console.error("Atlas connection required for live jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(filter.toLowerCase()) || 
    job.company.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <section className="bg-brand-dark text-white py-32 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-serif font-bold mb-6"
          >
            Elite Opportunities
          </motion.h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Vetted senior positions at industry-leading organizations.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-4 border border-gray-100">
          <div className="flex-grow relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
            <input 
              type="text" 
              placeholder="Search by role or company..." 
              className="w-full pl-16 pr-8 py-6 rounded-3xl bg-gray-50 focus:outline-none focus:border-brand-gold/30 font-serif text-lg"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-20 space-y-8">
          {loading ? (
            <div className="text-center py-40">
              <Loader2 size={64} className="animate-spin text-brand-gold mx-auto mb-4" />
              <p className="text-gray-400 font-serif text-xl">Connecting to Atlas Cloud...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={job.id} 
                className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-10"
              >
                <div className="space-y-4">
                  <h3 className="text-4xl font-serif font-bold text-brand-dark">{job.title}</h3>
                  <div className="flex gap-8 text-sm text-gray-500 font-bold uppercase tracking-widest">
                    <span className="flex items-center"><Briefcase size={18} className="mr-2 text-brand-gold" /> {job.company}</span>
                    <span className="flex items-center"><MapPin size={18} className="mr-2 text-brand-gold" /> {job.location}</span>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedJob(job)}
                  className="bg-brand-light text-brand-dark px-12 py-5 rounded-[2rem] font-serif font-black text-lg flex items-center justify-center group shadow-sm"
                >
                  View Role <ChevronRight size={22} className="ml-3 group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-gray-200">
              <p className="text-gray-400 font-serif text-2xl">No positions currently matching your search in MongoDB Atlas.</p>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl" onClick={() => setSelectedJob(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-16 space-y-12">
                <div className="flex justify-between items-center">
                  <h3 className="text-5xl font-serif font-bold text-brand-dark">{selectedJob.title}</h3>
                  <button onClick={() => setSelectedJob(null)} className="text-gray-300 hover:text-brand-dark"><X size={40}/></button>
                </div>
                <div className="bg-brand-light p-10 rounded-3xl border-l-8 border-brand-gold text-xl text-gray-700 font-serif italic whitespace-pre-wrap leading-relaxed">
                  {selectedJob.description}
                </div>
                <button 
                  onClick={() => { alert('Application feature requires Atlas cluster write permissions.'); setSelectedJob(null); }}
                  className="w-full bg-brand-dark text-white py-8 rounded-[2rem] font-serif font-black text-2xl flex items-center justify-center gap-4 hover:bg-brand-accent transition-all"
                >
                  Submit Executive Profile <Send size={24} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Jobs;
