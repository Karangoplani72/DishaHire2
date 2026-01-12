
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Loader2, ChevronRight, Filter } from 'lucide-react';
import { Job, EnquiryType } from '../types.ts';
import { db } from '../utils/db.ts';
import EnquiryModal from '../components/EnquiryModal.tsx';
import { motion, AnimatePresence } from 'framer-motion';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    db.getJobs().then(data => {
      setJobs(data || []);
      setLoading(false);
    });
  }, []);

  const handleApply = (title: string) => {
    setSelectedJobTitle(title);
    setModalOpen(true);
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(filterQuery.toLowerCase()) || 
    j.company.toLowerCase().includes(filterQuery.toLowerCase()) ||
    j.industry.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="bg-brand-light min-h-screen">
      <section className="bg-brand-dark text-white py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-8xl font-serif font-bold mb-6 tracking-tight">Active Roles</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-gray-400 max-w-2xl mx-auto font-serif italic">Vetted positions at industry-leading organizations, managed by our Rajkot headquarters.</motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-100 flex items-center gap-4">
          <div className="relative flex-1">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
             <input 
              type="text" 
              placeholder="Search by role, company, or vertical..." 
              className="w-full pl-16 pr-6 py-6 bg-gray-50 border-none rounded-3xl outline-none focus:bg-white focus:ring-2 ring-brand-gold/10 transition-all font-serif text-lg"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
             />
          </div>
          <div className="hidden md:flex items-center gap-2 bg-brand-light px-8 py-6 rounded-3xl border border-brand-gold/10 text-brand-dark font-black uppercase tracking-widest text-xs">
            <Filter size={18}/> {filteredJobs.length} Results
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
            <Loader2 className="animate-spin text-brand-gold" size={60}/>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Fetching Global Opportunities...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-8">
            {filteredJobs.map((job, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: idx * 0.05 }}
                key={job.id} 
                className="bg-white p-10 sm:p-14 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row justify-between items-center gap-8 group"
              >
                <div className="text-center md:text-left space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold bg-brand-gold/5 px-4 py-2 rounded-full border border-brand-gold/20 inline-block">{job.industry}</span>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark group-hover:text-brand-gold transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-8 text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2"><Briefcase size={16} className="text-brand-gold"/> {job.company}</span>
                    <span className="flex items-center gap-2"><MapPin size={16} className="text-brand-gold"/> {job.location}</span>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleApply(job.title)}
                  className="w-full md:w-auto bg-brand-dark text-white px-12 py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-xl shadow-brand-dark/10"
                >
                  Apply Now <ChevronRight size={22} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100 animate-in fade-in duration-700">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search size={40} className="text-gray-200" />
             </div>
             <p className="text-gray-400 font-serif text-2xl italic">No active roles found matching your criteria.</p>
             <button onClick={() => setFilterQuery('')} className="mt-8 text-brand-gold font-black uppercase tracking-widest text-[10px] hover:underline">Clear Search Filter</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <EnquiryModal 
            type={EnquiryType.CANDIDATE} 
            onClose={() => setModalOpen(false)} 
            initialSubject={selectedJobTitle}
            initialMessage={`Professional Application: I am officially expressing my interest in the "${selectedJobTitle}" position as listed on your platform.`}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Jobs;
