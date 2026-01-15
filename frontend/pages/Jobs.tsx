
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Building2, Search, ArrowUpRight, Clock, Filter, Sparkles } from 'lucide-react';
import { CONTACT_INFO, API_BASE_URL } from '../constants.tsx';

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
    fetch(`${API_BASE_URL}/api/jobs`)
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
      <section className="bg-brand-dark text-white py-20 sm:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-brand-gold/10 rounded-full blur-[80px] sm:blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-8">
              <Sparkles size={12} className="sm:size-[14px]" />
              <span>Premium Career Mandates</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold mb-6 sm:mb-8 tracking-tight">Elite <span className="text-brand-gold italic">Opportunities</span></h1>
            <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto font-serif italic leading-relaxed">
              Discover high-impact roles at leading organizations, curated exclusively for the top 1% of talent.
            </p>
          </MotionDiv>
        </div>
      </section>

      <section className="py-12 sm:py-20 -mt-8 sm:-mt-16 relative z-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-2 rounded-[2rem] sm:rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center mb-10 sm:mb-16 max-w-5xl mx-auto border border-gray-100 overflow-hidden">
            <div className="flex-grow flex items-center px-6 py-4 w-full">
              <Search className="text-brand-gold mr-3 sm:mr-4 flex-shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="Search roles or locations..." 
                className="w-full bg-transparent outline-none text-brand-dark font-medium placeholder:text-gray-300 text-sm sm:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="h-10 w-[1px] bg-gray-100 hidden md:block" />
            <div className="flex items-center px-6 py-4 w-full md:w-auto bg-gray-50 md:bg-transparent border-t md:border-t-0">
              <Filter className="text-brand-gold mr-3 sm:mr-4 flex-shrink-0" size={18} />
              <select 
                className="bg-transparent outline-none text-brand-dark font-bold text-[11px] sm:text-sm uppercase tracking-widest cursor-pointer w-full md:w-auto"
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
            <div className="text-center py-20 sm:py-32">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-8" />
              <p className="text-gray-500 font-serif italic text-lg sm:text-xl">Accessing secure career database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-10">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <MotionDiv 
                    key={job._id}
                    whileHover={{ y: -10 }}
                    className="bg-brand-dark p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[4rem] text-white border border-white/5 flex flex-col justify-between group h-full shadow-4xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity hidden sm:block">
                      <Briefcase size={120} />
                    </div>

                    <div className="space-y-6 sm:space-y-8 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="p-3 sm:p-4 bg-brand-gold/10 rounded-[1.5rem] text-brand-gold border border-brand-gold/20">
                          <Briefcase size={24} className="sm:size-[28px]" />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold bg-brand-gold/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-brand-gold/10">
                            {job.industry}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3 sm:mb-4 group-hover:text-brand-gold transition-colors leading-tight">
                          {job.title}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-300 font-medium">
                            <Building2 size={14} className="mr-3 text-brand-gold flex-shrink-0" /> 
                            <span className="tracking-wide uppercase text-[11px] font-bold">{job.company}</span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <MapPin size={14} className="mr-3 text-brand-gold flex-shrink-0" /> 
                            <span className="text-[13px]">{job.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="h-[1px] bg-gradient-to-r from-brand-gold/30 to-transparent w-full" />
                      
                      <p className="text-gray-400 text-[13px] sm:text-sm leading-relaxed italic font-serif line-clamp-4 sm:line-clamp-none group-hover:text-gray-300 transition-colors">
                        "{job.description}"
                      </p>
                    </div>

                    <button 
                      onClick={() => handleWhatsAppApply(job)}
                      className="mt-8 sm:mt-12 bg-brand-gold text-brand-dark py-4 sm:py-5 rounded-full font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[11px] sm:text-xs flex items-center justify-center hover:bg-yellow-500 transition-all shadow-xl shadow-brand-gold/10 group-hover:scale-[1.02]"
                    >
                      Instant WhatsApp Apply <ArrowUpRight size={16} className="ml-2" />
                    </button>
                  </MotionDiv>
                ))
              ) : (
                <div className="col-span-full text-center py-20 sm:py-32 bg-white rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl border border-gray-100 px-6">
                  <div className="w-20 h-20 sm:w-32 sm:h-32 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-8 sm:mb-10 text-gray-200">
                    <Search size={40} className="sm:size-[64px]" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark mb-4">No Mandates Found</h3>
                  <p className="text-gray-500 font-serif italic text-base sm:text-lg max-w-md mx-auto mb-8">
                    We couldn't find any opportunities matching your current selection. 
                  </p>
                  <button 
                    onClick={() => { setSearch(''); setActiveFilter('All'); }} 
                    className="text-brand-gold font-black uppercase tracking-widest text-[10px] sm:text-[11px] hover:underline"
                  >
                    Reset Global Search
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-brand-dark/5 border-t border-brand-dark/5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-gray-400 mb-8">Global Placement Partners</p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 grayscale opacity-40">
            <span className="text-lg sm:text-2xl font-serif font-bold text-brand-dark">TECHCORE</span>
            <span className="text-lg sm:text-2xl font-serif font-bold text-brand-dark">BEYOND HR</span>
            <span className="text-lg sm:text-2xl font-serif font-bold text-brand-dark">VIRTUE GROUP</span>
            <span className="text-lg sm:text-2xl font-serif font-bold text-brand-dark">ELITE SOLUTIONS</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Jobs;
