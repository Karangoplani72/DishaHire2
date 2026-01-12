
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Loader2 } from 'lucide-react';
import { Job } from '../types.ts';
import { db } from '../utils/db.ts';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getJobs().then(data => {
      setJobs(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-brand-light min-h-screen">
      <section className="bg-brand-dark text-white py-20 text-center">
        <h1 className="text-4xl font-serif font-bold">Opportunities</h1>
      </section>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-brand-gold" size={40}/></div>
        ) : (
          <div className="space-y-6">
            {jobs.map(job => (
              <div key={job.id} className="bg-white p-8 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-xl font-bold text-brand-dark">{job.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><Briefcase size={14}/> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                  </div>
                </div>
                <button className="bg-brand-dark text-white px-6 py-2 rounded-full font-bold">Apply Now</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
