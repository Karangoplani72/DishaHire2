
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Loader2, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { db } from '../utils/db.ts';
import { Enquiry, ApplicationStatus } from '../types.ts';
import { useAuth } from '../components/AuthContext.tsx';
import { Link } from 'react-router-dom';

const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
  const configs: Record<ApplicationStatus, { label: string, color: string, icon: any }> = {
    PENDING: { label: 'In Review', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Clock size={12}/> },
    // Added REPLIED status configuration to resolve exhaustive Record error
    REPLIED: { label: 'Replied', color: 'bg-yellow-50 text-yellow-600 border-yellow-100', icon: <CheckCircle size={12}/> },
    REVIEWING: { label: 'Reviewing', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: <AlertCircle size={12}/> },
    INTERVIEWING: { label: 'Interviewing', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: <AlertCircle size={12}/> },
    SHORTLISTED: { label: 'Shortlisted', color: 'bg-brand-gold/10 text-brand-gold border-brand-gold/20', icon: <CheckCircle size={12}/> },
    OFFERED: { label: 'Offered', color: 'bg-green-50 text-green-600 border-green-100', icon: <CheckCircle size={12}/> },
    REJECTED: { label: 'Closed', color: 'bg-red-50 text-red-600 border-red-100', icon: <XCircle size={12}/> },
    ARCHIVED: { label: 'Archived', color: 'bg-gray-100 text-gray-500 border-gray-200', icon: <Clock size={12}/> }
  };

  const config = configs[status] || configs.PENDING;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${config.color}`}>
      {config.icon}
      {config.label}
    </div>
  );
};

const MyApplications: React.FC = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      db.getMyApplications(user.email).then(data => {
        setApps(data || []);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-brand-gold mx-auto" size={48} />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <header className="bg-brand-dark text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-serif font-bold mb-4">My Applications</h1>
          <p className="text-gray-400 font-serif italic text-lg">Track your professional journey with DishaHire.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        {apps.length > 0 ? (
          <div className="space-y-6">
            {apps.map((app, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={app.id} 
                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center text-brand-gold">
                    <Briefcase size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-dark">
                      {app.subject || 'Direct Inquiry'}
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                      Submitted on {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={app.status as ApplicationStatus} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-[3rem] border border-dashed border-gray-200 text-center space-y-8">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
               <Briefcase size={40} className="text-gray-200" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-brand-dark">No Active Applications</h2>
              <p className="text-gray-400 max-w-sm mx-auto">You haven't submitted any applications or inquiries yet. Explore our current openings to get started.</p>
            </div>
            <Link to="/jobs" className="inline-flex items-center gap-2 bg-brand-dark text-white px-10 py-4 rounded-2xl font-bold hover:bg-brand-accent transition-all">
              Explore Active Roles <ChevronRight size={18} />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyApplications;
