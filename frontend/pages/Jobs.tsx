
import React, { useState, useEffect } from 'react';
// Fixed: Using any casting for motion components to bypass property missing errors
import { motion, AnimatePresence } from 'framer-motion';
const MotionH1 = (motion as any).h1;
const MotionP = (motion as any).p;
const MotionDiv = (motion as any).div;
import { Search, MapPin, Briefcase, Filter, ChevronRight, X, Loader2, Send } from 'lucide-react';
import { Job, EnquiryType } from '../types.ts';
import { db } from '../utils/db.ts';
import EnquiryModal from '../components/EnquiryModal.tsx';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    db.getJobs().then(data => {
      setJobs(data || []);
      setLoading(false);
    });
  }, []);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(filterQuery.toLowerCase()) || 
    j.company.toLowerCase().includes(filterQuery.toLowerCase()) ||
    j.industry.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <section className="bg-brand-dark text-white py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gold/5 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <MotionH1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-serif font-bold mb-6"
          >
            Elite Opportunities
          </MotionH1>
          <MotionP 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto font-serif italic"
          >
            Vetted senior positions at industry-leading organizations, managed directly via our premium network.
          </MotionP>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-100 flex items-center gap-4">
          <div className="relative flex-1">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
             <input 
              type="text" 
              placeholder="Search roles or companies..." 
              className="w-full pl-16 pr-6 py-6 bg-gray-50 border-none rounded-3xl outline-none focus:bg-white focus:ring-2 ring-brand-gold/10 transition-all font-serif text-lg"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
             />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-20">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="animate-spin text-brand-gold mx-auto" size={48} />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-8">
            {filteredJobs.map((job, idx) => (
              <MotionDiv 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: idx * 0.05 }}
                key={job.id} 
                className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row justify-between items-center gap-8 group"
              >
                <div className="text-center md:text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-2 block">{job.industry}</span>
                  <h3 className="text-3xl font-serif font-bold text-brand-dark group-hover:text-brand-gold transition-colors">{job.title}</h3>
                  <div className="flex gap-6 text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">
                    <span className="flex items-center gap-1"><Briefcase size={14}/> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="text-xs font-bold uppercase tracking-widest text-brand-gold hover:underline"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleApply(job)}
                    className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-brand-accent transition-all"
                  >
                    Apply Now <ChevronRight size={18} />
                  </button>
                </div>
              </MotionDiv>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
             <p className="text-gray-400 font-serif italic text-xl">No roles found matching your search.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedJob && !modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md" onClick={() => setSelectedJob(null)} />
            <MotionDiv initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden relative z-10 shadow-2xl flex flex-col max-h-[90vh]">
              <div className="bg-brand-dark p-12 text-white relative flex-shrink-0">
                <button onClick={() => setSelectedJob(null)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-all"><X size={32}/></button>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold mb-2">Detailed Context</div>
                <h3 className="text-4xl sm:text-5xl font-serif font-bold mb-4">{selectedJob.title}</h3>
                <p className="text-brand-gold font-serif text-xl italic">{selectedJob.company} — {selectedJob.location}</p>
              </div>
              <div className="p-12 overflow-y-auto space-y-12">
                <div className="bg-brand-light p-10 rounded-3xl border-l-[8px] border-brand-gold text-xl text-gray-700 font-serif italic leading-relaxed whitespace-pre-wrap">
                  {selectedJob.description}
                </div>
                <button 
                  onClick={() => setModalOpen(true)}
                  className="w-full bg-brand-dark text-white py-6 rounded-3xl font-black text-2xl flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-xl"
                >
                  Proceed to Application <Send size={24} />
                </button>
              </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && (
          <EnquiryModal 
            type={EnquiryType.CANDIDATE} 
            onClose={() => { setModalOpen(false); setSelectedJob(null); }} 
            initialSubject={selectedJob?.title}
            initialMessage={`Official interest in the ${selectedJob?.title} position at ${selectedJob?.company}. I have reviewed the requirements and believe my background aligns with your strategic objectives.`}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Jobs;
