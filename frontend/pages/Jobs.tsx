
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Building2, Search, ArrowUpRight, Clock, Filter, Sparkles } from 'lucide-react';
import { CONTACT_INFO } from '../constants.tsx';

const MotionDiv = (motion as any).div;

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    setLoading(true);
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch mandates:", err);
        setLoading(false);
      });
  };

  const industries = ['All', ...new Set(jobs.map(j => j.industry))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = activeFilter === 'All' || job.industry === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleWhatsAppApply = (job: any) => {
    const message = `Hi DishaHire Team!%0A%0AI saw this job posting on your website and would like to apply:%0A%0A🚀 *Role:* ${job.title}%0A🏢 *Company:* ${job.company}%0A📍 *Location:* ${job.location}%0A💼 *Industry:* ${job.industry}%0A%0AI have my profile ready. Could you please share the next steps?`;
    window.open(`${CONTACT_INFO.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-brand-light min-h-screen">
      {/* Dynamic Header */}
      <section className="bg-brand-dark text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Sparkles size={14} />
              <span>Premium Career Mandates</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 tracking-tight">Elite <span className="text-brand-gold italic">Opportunities</span></h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-serif italic">
              Discover high-impact roles at leading organizations, curated exclusively for the top 1% of talent.
            </p>
          </MotionDiv>
        </div>
      </section>

      <section className="py-20 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-2 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center mb-16 max-w-5xl mx-auto border border-gray-100">
            <div className="flex-grow flex items-center px-6 py-4 w-full">
              <Search className="text-brand-gold mr-4" size={24} />
              <input 
                type="text" 
                placeholder="Search by role, company, or city..." 
                className="w-full bg-transparent outline-none text-brand-dark font-medium placeholder:text-gray-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="h-10 w-[1px] bg-gray-100 hidden md:block" />
            <div className="flex items-center px-6 py-4 w-full md:w-auto">
              <Filter className="text-brand-gold mr-4" size={20} />
              <select 
                className="bg-transparent outline-none text-brand-dark font-bold text-sm uppercase tracking-widest cursor-pointer"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-32">
              <div className="w-20 h-20 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-8" />
              <p className="text-gray-500 font-serif italic text-xl">Accessing secure career database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <MotionDiv 
                    key={job._id}
                    whileHover={{ y: -10 }}
                    className="bg-brand-dark p-10 rounded-[4rem] text-white border border-white/5 flex flex-col justify-between group h-full shadow-4xl relative overflow-hidden"
                  >
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <Briefcase size={120} />
                    </div>

                    <div className="space-y-8 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="p-4 bg-brand-gold/10 rounded-3xl text-brand-gold border border-brand-gold/20">
                          <Briefcase size={28} />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold bg-brand-gold/5 px-4 py-2 rounded-full border border-brand-gold/10">
                            {job.industry}
                          </span>
                          <div className="flex items-center text-[9px] text-gray-500 mt-2 uppercase tracking-widest font-bold">
                            <Clock size={10} className="mr-1" /> Just Posted
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-3xl font-serif font-bold mb-4 group-hover:text-brand-gold transition-colors leading-tight">
                          {job.title}
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-300 font-medium">
                            <Building2 size={16} className="mr-3 text-brand-gold" /> 
                            <span className="tracking-wide uppercase text-xs font-bold">{job.company}</span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <MapPin size={16} className="mr-3 text-brand-gold" /> 
                            <span className="text-sm">{job.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="h-[1px] bg-gradient-to-r from-brand-gold/30 to-transparent w-full" />
                      
                      <p className="text-gray-400 text-sm leading-relaxed italic font-serif line-clamp-4 group-hover:text-gray-300 transition-colors">
                        "{job.description}"
                      </p>
                    </div>

                    <button 
                      onClick={() => handleWhatsAppApply(job)}
                      className="mt-12 bg-brand-gold text-brand-dark py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center hover:bg-yellow-500 transition-all shadow-xl shadow-brand-gold/10 group-hover:scale-[1.02]"
                    >
                      Instant WhatsApp Apply <ArrowUpRight size={18} className="ml-2" />
                    </button>
                  </MotionDiv>
                ))
              ) : (
                <div className="col-span-full text-center py-32 bg-white rounded-[4rem] shadow-2xl border border-gray-100">
                  <div className="w-32 h-32 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-10 text-gray-200">
                    <Search size={64} />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-brand-dark mb-4">No Mandates Found</h3>
                  <p className="text-gray-500 font-serif italic text-lg max-w-md mx-auto mb-8">
                    We couldn't find any opportunities matching your current selection. 
                  </p>
                  <button 
                    onClick={() => { setSearch(''); setActiveFilter('All'); }} 
                    className="text-brand-gold font-black uppercase tracking-widest text-[11px] hover:underline"
                  >
                    Reset Global Search
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-20 bg-brand-dark/5 border-t border-brand-dark/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-8">Global Placement Partners</p>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
            {/* These would typically be logos */}
            <span className="text-2xl font-serif font-bold text-brand-dark">TECHCORE</span>
            <span className="text-2xl font-serif font-bold text-brand-dark">BEYOND HR</span>
            <span className="text-2xl font-serif font-bold text-brand-dark">VIRTUE GROUP</span>
            <span className="text-2xl font-serif font-bold text-brand-dark">ELITE SOLUTIONS</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Jobs;
