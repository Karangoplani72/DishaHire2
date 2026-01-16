
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Users, Banknote, Search, ArrowUpRight, Filter, Sparkles, MapPin, Factory } from 'lucide-react';
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
        console.error("Fetch failed:", err);
        setLoading(false);
      });
  };

  const industries = ['All', ...new Set(jobs.map(j => j.industry))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.education.toLowerCase().includes(search.toLowerCase()) ||
      job.industry.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = activeFilter === 'All' || job.industry === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleWhatsAppApply = (job: any) => {
    // Using a template literal with encodeURIComponent is the most robust way
    // to ensure details like spaces in job titles or locations don't break the URL on PC/Laptops.
    const text = `Hi DishaHire Team!

I saw this job posting on your website and would like to apply:

*Role:* ${job.title}
*Location:* ${job.location}
*Education:* ${job.education}
*Gender:* ${job.gender}
*Salary:* ${job.salary}
*Industry:* ${job.industry}

I have my profile ready. Could you please share the next steps?`;

    const encodedText = encodeURIComponent(text);
    window.open(`${CONTACT_INFO.whatsapp}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <section className="bg-brand-dark text-white pt-16 sm:pt-24 pb-24 sm:pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-8">
              <Sparkles size={12} className="sm:size-[14px]" />
              <span>Premium Career Mandates</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-serif font-bold mb-4 sm:mb-8 tracking-tight">Elite <span className="text-brand-gold italic">Opportunities</span></h1>
            <p className="text-sm sm:text-xl text-gray-400 max-w-2xl mx-auto font-serif italic leading-relaxed px-4">
              Curated mandates for professional excellence across diverse industries.
            </p>
          </MotionDiv>
        </div>
      </section>

      <section className="py-8 sm:py-20 -mt-10 sm:-mt-16 relative z-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-2 rounded-[1.5rem] sm:rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center mb-10 sm:mb-16 max-w-5xl mx-auto border border-gray-100 overflow-hidden">
            <div className="flex-grow flex items-center px-4 sm:px-6 py-3 sm:py-4 w-full">
              <Search className="text-brand-gold mr-3 flex-shrink-0" size={18} />
              <input 
                type="text" 
                placeholder="Search mandates..." 
                className="w-full bg-transparent outline-none text-brand-dark font-medium placeholder:text-gray-300 text-sm sm:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="h-10 w-[1px] bg-gray-100 hidden md:block" />
            <div className="flex items-center px-4 sm:px-6 py-3 sm:py-4 w-full md:w-auto bg-gray-50 md:bg-transparent border-t md:border-t-0">
              <Filter className="text-brand-gold mr-3 flex-shrink-0" size={16} />
              <select 
                className="bg-transparent outline-none text-brand-dark font-bold text-[10px] sm:text-sm uppercase tracking-widest cursor-pointer w-full"
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
            <div className="text-center py-20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-6 sm:mb-8" />
              <p className="text-gray-500 font-serif italic text-base sm:text-lg">Fetching career paths...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <MotionDiv 
                    key={job._id}
                    whileHover={{ y: -8 }}
                    className="bg-brand-dark p-8 sm:p-10 rounded-[2rem] sm:rounded-[4rem] text-white border border-white/5 flex flex-col justify-between group h-full shadow-4xl relative overflow-hidden"
                  >
                    <div className="space-y-6 sm:space-y-8 relative z-10">
                      <div className="flex justify-between items-start gap-4">
                        <div className="p-3 bg-brand-gold/10 rounded-[1.2rem] sm:rounded-[1.5rem] text-brand-gold border border-brand-gold/20 shrink-0">
                          <Briefcase size={24} className="sm:size-[28px]" />
                        </div>
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-brand-gold bg-brand-gold/5 px-3 py-1.5 rounded-full border border-brand-gold/10 text-right leading-tight">
                          {job.industry}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-brand-gold mb-2 space-x-1">
                          <MapPin size={12} />
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{job.location}</span>
                        </div>
                        <h3 className="text-xl sm:text-3xl font-serif font-bold mb-6 group-hover:text-brand-gold transition-colors leading-tight min-h-[3.5rem] line-clamp-2">
                          {job.title}
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <Factory size={16} className="mr-3 sm:mr-4 text-brand-gold flex-shrink-0 mt-0.5" />
                            <div className="overflow-hidden">
                              <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-500">Business Sector</p>
                              <p className="text-gray-200 text-xs sm:text-sm font-medium">{job.industry}</p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <GraduationCap size={16} className="mr-3 sm:mr-4 text-brand-gold flex-shrink-0 mt-0.5" />
                            <div className="overflow-hidden">
                              <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-500">Education</p>
                              <p className="text-gray-200 text-xs sm:text-sm font-medium truncate">{job.education}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Users size={16} className="mr-3 sm:mr-4 text-brand-gold flex-shrink-0 mt-0.5" />
                            <div className="overflow-hidden">
                              <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-500">Target Profile</p>
                              <p className="text-gray-200 text-xs sm:text-sm font-medium">{job.gender}</p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <Banknote size={16} className="mr-3 sm:mr-4 text-brand-gold flex-shrink-0 mt-0.5" />
                            <div className="overflow-hidden">
                              <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-500">Compensation Slab</p>
                              <p className="text-brand-gold font-bold text-sm sm:text-base truncate">{job.salary}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleWhatsAppApply(job)}
                      className="mt-8 sm:mt-10 bg-brand-gold text-brand-dark py-4 sm:py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] flex items-center justify-center hover:bg-yellow-500 transition-all shadow-xl"
                    >
                      Instant Inquiry <ArrowUpRight size={14} className="ml-2 sm:size-[16px]" />
                    </button>
                  </MotionDiv>
                ))
              ) : (
                <div className="col-span-full text-center py-16 sm:py-20 bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl px-6">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark mb-4">No Mandates Found</h3>
                  <button onClick={() => { setSearch(''); setActiveFilter('All'); }} className="text-brand-gold font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:underline">Reset Session Filters</button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Jobs;
