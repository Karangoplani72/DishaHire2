
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, Filter, ChevronRight, X, FileText, AlertCircle, Shield, Loader2, Send } from 'lucide-react';
import { Job } from '../types';
import { db } from '../utils/db.ts';

const Jobs: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
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
      console.error("Failed to load jobs from database service.");
      setJobs([]);
    } finally {
      // Adding a small delay for a smoother premium loading experience
      setTimeout(() => setLoading(false), 800);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(filter.toLowerCase()) || 
    job.company.toLowerCase().includes(filter.toLowerCase()) ||
    job.industry.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <section className="bg-brand-dark text-white py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gold/5 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-serif font-bold mb-6"
          >
            Elite Opportunities
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Vetted senior positions at industry-leading organizations, managed directly via our premium network.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-4 border border-gray-100"
        >
          <div className="flex-grow relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
            <input 
              type="text" 
              placeholder="Search by role, company, or industry..." 
              className="w-full pl-16 pr-8 py-6 rounded-3xl bg-gray-50 focus:outline-none focus:border-brand-gold/30 font-serif text-lg transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button className="bg-brand-dark text-white px-12 py-6 rounded-3xl font-serif font-black text-lg flex items-center justify-center gap-3 hover:bg-brand-accent transition-all shadow-xl">
            <Filter size={20} /> Refine
          </button>
        </motion.div>

        <div className="mt-20 space-y-10">
          {loading ? (
            <div className="text-center py-40">
              <Loader2 size={64} className="animate-spin text-brand-gold mx-auto mb-6" />
              <p className="text-gray-400 font-serif text-2xl animate-pulse">Accessing Secure Database...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <AnimatePresence>
              {filteredJobs.map((job, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={job.id} 
                  className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-10 border-l-[12px] border-l-transparent hover:border-l-brand-gold group"
                >
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold bg-brand-gold/5 px-4 py-2 rounded-full border border-brand-gold/20">{job.industry}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Verified Listing</span>
                    </div>
                    <h3 className="text-4xl font-serif font-bold text-brand-dark group-hover:text-brand-gold transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-10 text-sm text-gray-500 font-bold uppercase tracking-widest">
                      <span className="flex items-center"><Briefcase size={20} className="mr-3 text-brand-gold" /> {job.company}</span>
                      <span className="flex items-center"><MapPin size={20} className="mr-3 text-brand-gold" /> {job.location}</span>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedJob(job)}
                    className="bg-brand-light text-brand-dark px-14 py-6 rounded-[2rem] font-serif font-black text-xl flex items-center justify-center group/btn shadow-sm hover:bg-brand-dark hover:text-white transition-all"
                  >
                    View Role <ChevronRight size={24} className="ml-4 group-hover/btn:translate-x-2 transition-transform" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-gray-200"
            >
              <Search size={64} className="mx-auto text-gray-200 mb-8" />
              <p className="text-gray-400 font-serif text-3xl">No positions found matching your criteria.</p>
              <button onClick={() => setFilter('')} className="mt-8 text-brand-gold font-black uppercase tracking-widest hover:underline">Clear all filters</button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl" 
              onClick={() => setSelectedJob(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 40 }} 
              className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden relative z-10 shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="bg-brand-dark p-16 text-white relative">
                <button onClick={() => setSelectedJob(null)} className="absolute top-12 right-12 text-white/40 hover:text-white transition-all hover:rotate-90">
                  <X size={44}/>
                </button>
                <div className="inline-block bg-brand-gold text-brand-dark px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.4em] mb-8">Executive Placement</div>
                <h3 className="text-6xl font-serif font-bold leading-tight mb-4">{selectedJob.title}</h3>
                <p className="text-brand-gold font-serif text-2xl italic">{selectedJob.company} — {selectedJob.location}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-16 space-y-16">
                <div className="space-y-10">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] flex items-center gap-6">
                    <div className="w-12 h-px bg-brand-gold" /> Strategic Context
                  </h4>
                  <div className="bg-brand-light p-12 rounded-[2.5rem] border-l-[12px] border-brand-gold text-2xl text-gray-700 font-serif italic whitespace-pre-wrap leading-relaxed shadow-inner">
                    {selectedJob.description}
                  </div>
                </div>
                <div className="pt-10 border-t border-gray-100 flex flex-col gap-8">
                  <p className="text-gray-400 text-sm font-serif italic">This is a highly confidential search. Direct application is required for professional vetting.</p>
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { alert('Success: Your profile has been sent to our executive search team.'); setSelectedJob(null); }}
                    className="w-full bg-brand-dark text-white py-10 rounded-[2rem] font-serif font-black text-3xl shadow-4xl flex items-center justify-center gap-6 hover:bg-brand-accent transition-all"
                  >
                    Submit Application <Send size={32} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Jobs;
