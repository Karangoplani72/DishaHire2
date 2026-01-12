
import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Filter, ChevronRight, X } from 'lucide-react';
import { INDUSTRIES } from '../constants';
import { Job } from '../types';

const MOCK_JOBS: Job[] = [
  { id: '1', title: 'Senior Software Architect', company: 'Global Tech', location: 'Remote / Bangalore', type: 'Full-time', industry: 'IT & Technology', description: 'Looking for an experienced architect to lead our scalable cloud-native infrastructure...', postedDate: '2 days ago' },
  { id: '2', title: 'Product Marketing Manager', company: 'Creative Solutions', location: 'Mumbai', type: 'Full-time', industry: 'Sales & Marketing', description: 'Driving GTM strategies for international software markets...', postedDate: '1 week ago' },
  { id: '3', title: 'Plant Operations Lead', company: 'Industrial Core', location: 'Pune', type: 'Full-time', industry: 'Manufacturing', description: 'Managing multi-site plant operations and logistics compliance...', postedDate: '3 days ago' },
  { id: '4', title: 'HR Strategy Consultant', company: 'BizConsult', location: 'Delhi / NCR', type: 'Contract', industry: 'HR Consultancy', description: 'Developing organizational design frameworks for high-growth startups...', postedDate: '5 days ago' },
];

const Jobs: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filteredJobs = MOCK_JOBS.filter(job => 
    job.title.toLowerCase().includes(filter.toLowerCase()) || 
    job.industry.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <section className="bg-brand-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Current Opportunities</h1>
          <p className="text-gray-400 max-w-xl mx-auto">We exclusively handle senior and specialized roles for our partner organizations.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by role or industry..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-brand-gold"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <select className="px-6 py-4 rounded-xl border border-gray-100 focus:outline-none bg-white font-bold text-sm text-brand-dark">
            <option>All Locations</option>
            <option>Mumbai</option>
            <option>Bangalore</option>
            <option>Remote</option>
          </select>
          <button className="bg-brand-dark text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
            <Filter size={20} /> Filter
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-light px-2 py-1 rounded">{job.industry}</span>
                    <span className="text-xs text-gray-400">{job.postedDate}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark">{job.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center"><Briefcase size={16} className="mr-1" /> {job.company}</span>
                    <span className="flex items-center"><MapPin size={16} className="mr-1" /> {job.location}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJob(job)}
                  className="bg-brand-light text-brand-dark px-8 py-3 rounded-xl font-bold hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center"
                >
                  View & Apply <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">
              No matching roles found. Send us your CV for future opportunities.
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm" onClick={() => setSelectedJob(null)} />
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden relative z-10 animate-in zoom-in duration-300">
            <div className="bg-brand-dark p-8 text-white relative">
              <button onClick={() => setSelectedJob(null)} className="absolute top-8 right-8 text-white/50 hover:text-white">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-serif font-bold">{selectedJob.title}</h3>
              <p className="text-brand-gold font-bold">{selectedJob.company} • {selectedJob.location}</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-gray-600 text-sm leading-relaxed">
                <h4 className="font-bold text-brand-dark mb-2">Job Description</h4>
                {selectedJob.description}
              </div>
              
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <h4 className="font-bold text-brand-dark uppercase tracking-widest text-xs">Express Interest</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" className="p-4 bg-gray-50 rounded-xl border border-transparent focus:border-brand-gold focus:bg-white outline-none w-full" />
                  <input type="email" placeholder="Email Address" className="p-4 bg-gray-50 rounded-xl border border-transparent focus:border-brand-gold focus:bg-white outline-none w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resume / CV</label>
                  <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-8 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-brand-light file:text-brand-dark hover:file:bg-brand-dark hover:file:text-white transition-all" />
                </div>
                <button className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold shadow-xl hover:bg-brand-accent transition">Submit Application</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
