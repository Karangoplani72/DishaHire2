
import React from 'react';
import { X, Send, User, Building, MapPin, ClipboardList } from 'lucide-react';
import { EnquiryType } from '../types';

interface Props {
  type: EnquiryType;
  onClose: () => void;
}

const EnquiryModal: React.FC<Props> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden relative z-10 flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Left Side Info */}
        <div className="md:w-1/3 bg-brand-dark p-10 text-white flex flex-col justify-between">
          <div className="space-y-6">
             <div className="text-brand-gold font-bold uppercase tracking-widest text-xs">Partner with us</div>
             <h3 className="text-3xl font-serif font-bold">
               {type === EnquiryType.CANDIDATE ? 'Take the Next Step' : 'Hire Best-in-Class Talent'}
             </h3>
             <p className="text-gray-400 text-sm leading-relaxed">
               {type === EnquiryType.CANDIDATE 
                 ? 'Let us match your skills with exclusive opportunities at India\'s top firms.' 
                 : 'Tell us about your requirements and our experts will reach out with a custom strategy.'}
             </p>
          </div>
          
          <div className="space-y-4 pt-10">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><MapPin size={16} className="text-brand-gold"/></div>
              <span>Mumbai, India</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><ClipboardList size={16} className="text-brand-gold"/></div>
              <span>ISO 9001 Certified</span>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="flex-1 p-10 max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-brand-dark">
            <X size={24} />
          </button>
          
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Enquiry Sent Successfully!'); onClose(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:border-brand-gold focus:bg-white outline-none" placeholder="John Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                <input required type="email" className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:border-brand-gold focus:bg-white outline-none" placeholder="john@example.com" />
              </div>
            </div>

            {type === EnquiryType.EMPLOYER && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input required type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:border-brand-gold focus:bg-white outline-none" placeholder="Tech Corp Ltd." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Urgency</label>
                  <select className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:border-brand-gold focus:bg-white outline-none font-medium">
                    <option>Normal Priority</option>
                    <option>High Priority (Immediate Hiring)</option>
                  </select>
                </div>
              </div>
            )}

            {type === EnquiryType.CANDIDATE && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Experience</label>
                  <input required type="text" className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:border-brand-gold focus:bg-white outline-none" placeholder="e.g. 5 Years" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Primary Skills</label>
                  <input required type="text" className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:border-brand-gold focus:bg-white outline-none" placeholder="e.g. React, Node, Python" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Additional Details / Requirements</label>
              <textarea rows={4} className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:border-brand-gold focus:bg-white outline-none resize-none" placeholder="Please provide more context..."></textarea>
            </div>

            {type === EnquiryType.CANDIDATE && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Upload Resume (PDF only)</label>
                <div className="border-2 border-dashed border-gray-100 rounded-xl p-6 text-center hover:border-brand-gold transition cursor-pointer bg-gray-50">
                   <p className="text-xs text-gray-400">Click to upload or drag and drop</p>
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest max-w-[200px]">By submitting, you agree to our privacy & data processing terms.</p>
              <button className="bg-brand-dark text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:bg-brand-accent transition">
                Send Enquiry <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
