
import React, { useState } from 'react';
import { X, Send, User, MapPin, Loader2, Mail } from 'lucide-react';
import { db } from '../utils/db.ts';

interface Props {
  onClose: () => void;
}

const EnquiryModal: React.FC<Props> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const enquiryData = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        company: formData.get('company'),
        createdAt: new Date().toISOString()
      };

      await db.addEnquiry(enquiryData);
      alert('Thank you! Your enquiry has been received. Our team will contact you shortly.');
      onClose();
    } catch (err) {
      alert('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden relative z-10 flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="md:w-1/3 bg-brand-dark p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold" />
          <div className="space-y-8 relative z-10">
             <div className="text-brand-gold font-black uppercase tracking-[0.3em] text-[10px] border border-brand-gold/20 inline-block px-3 py-1 rounded-full">Secure Partner Portal</div>
             <h3 className="text-4xl font-serif font-bold leading-tight">Strategic Partnership</h3>
             <p className="text-gray-400 text-sm leading-relaxed font-medium">
               Consult with our experts for organizational growth and talent strategies.
             </p>
          </div>
          
          <div className="space-y-6 pt-12 relative z-10 border-t border-white/5">
            <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-widest text-gray-300">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"><MapPin size={18} className="text-brand-gold"/></div>
              <span>Corporate Hub</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-12 max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-brand-dark transition-colors">
            <X size={28} />
          </button>
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required name="name" type="text" className="w-full pl-14 pr-5 py-5 bg-gray-50 border border-transparent rounded-2xl focus:border-brand-gold/30 focus:bg-white outline-none transition-all font-serif" placeholder="Legal Name" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required name="email" type="email" className="w-full pl-14 pr-5 py-5 bg-gray-50 border border-transparent rounded-2xl focus:border-brand-gold/30 focus:bg-white outline-none transition-all font-serif" placeholder="name@company.com" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Organization Name</label>
              <input required name="company" type="text" className="w-full px-5 py-5 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-gold/30 focus:bg-white outline-none transition-all font-serif" placeholder="Company Ltd." />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Message</label>
              <textarea required name="message" rows={4} className="w-full px-5 py-5 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-gold/30 focus:bg-white outline-none transition-all resize-none font-serif" placeholder="Describe your requirements..."></textarea>
            </div>

            <div className="pt-8">
              <button disabled={loading} className="w-full sm:w-auto bg-brand-dark text-white px-12 py-5 rounded-2xl font-serif font-black text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-brand-accent transition transform hover:-translate-y-1">
                {loading ? <Loader2 className="animate-spin" /> : <>Send Message <Send size={20} /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
