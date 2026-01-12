
import React, { useState } from 'react';
import { X, Send, User, Building, MapPin, ClipboardList, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { EnquiryType } from '../types';
import { db } from '../utils/db.ts';

interface Props {
  type: EnquiryType;
  onClose: () => void;
}

const EnquiryModal: React.FC<Props> = ({ type, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError('');
    
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        setFileError('File size exceeds 4MB limit.');
        setFile(null);
        return;
      }
      if (selectedFile.type !== 'application/pdf') {
        setFileError('Only PDF documents are allowed.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === EnquiryType.CANDIDATE && !file) {
      setFileError('Please upload your resume.');
      return;
    }
    
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      let resumeData = '';
      if (file) {
        resumeData = await toBase64(file);
      }

      const enquiryData = {
        type,
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        company: formData.get('company'),
        priority: formData.get('priority') === 'High Priority (Urgent Hiring)' ? 'HIGH' : 'NORMAL',
        experience: formData.get('experience'),
        role: formData.get('role'),
        resumeName: file?.name,
        resumeData // Real storage in Mongo
      };

      await db.addEnquiry(enquiryData);
      alert('Thank you! Your enquiry has been securely stored in our MongoDB cluster. Our team will contact you shortly.');
      onClose();
    } catch (err) {
      alert('Transmission failed. Please check your internet connection and file size.');
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
             <h3 className="text-4xl font-serif font-bold leading-tight">
               {type === EnquiryType.CANDIDATE ? 'Professional Direction' : 'Expert Talent Sourcing'}
             </h3>
             <p className="text-gray-400 text-sm leading-relaxed font-medium">
               Your professional data is encrypted via MongoDB security layer.
             </p>
          </div>
          
          <div className="space-y-6 pt-12 relative z-10 border-t border-white/5">
            <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-widest text-gray-300">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"><MapPin size={18} className="text-brand-gold"/></div>
              <span>Corporate Mumbai Hub</span>
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
                  <input required name="name" type="text" className="w-full pl-14 pr-5 py-5 bg-gray-50 border border-transparent rounded-2xl focus:border-brand-gold/30 focus:bg-white outline-none transition-all font-serif" placeholder="e.g. Sanjay Sharma" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Professional Email</label>
                <input required name="email" type="email" className="w-full px-5 py-5 bg-gray-50 border border-transparent rounded-2xl focus:border-brand-gold/30 focus:bg-white outline-none transition-all font-serif" placeholder="name@company.com" />
              </div>
            </div>

            {type === EnquiryType.EMPLOYER && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Organization Name</label>
                  <input required name="company" type="text" className="w-full px-5 py-5 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-gold/30 focus:bg-white outline-none transition-all font-serif" placeholder="Company Ltd." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Priority</label>
                  <select name="priority" className="w-full px-5 py-5 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-gold/30 focus:bg-white outline-none font-bold text-brand-dark">
                    <option>Standard Engagement</option>
                    <option className="text-red-600 font-black">High Priority</option>
                  </select>
                </div>
              </div>
            )}

            {type === EnquiryType.CANDIDATE && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Experience</label>
                  <input required name="experience" type="text" className="w-full px-5 py-5 bg-gray-50 border border-transparent rounded-2xl focus:border-brand-gold/30 focus:bg-white transition-all font-serif" placeholder="e.g. 10 Years" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Message</label>
              <textarea name="message" rows={4} className="w-full px-5 py-5 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-gold/30 focus:bg-white outline-none transition-all resize-none font-serif" placeholder="Describe your needs..."></textarea>
            </div>

            {type === EnquiryType.CANDIDATE && (
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Resume (PDF, Max 4MB)</label>
                <div className={`relative border-2 border-dashed ${fileError ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'} rounded-3xl p-10 text-center hover:border-brand-gold/40 transition-all cursor-pointer`}>
                   <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                   {file ? <div className="text-brand-dark font-serif font-bold">{file.name}</div> : <p className="text-sm font-serif font-bold text-brand-dark">Click to select PDF</p>}
                </div>
                {fileError && <p className="text-red-500 text-[10px] font-black">{fileError}</p>}
              </div>
            )}

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100">
              <button disabled={loading} className="w-full sm:w-auto bg-brand-dark text-white px-12 py-5 rounded-2xl font-serif font-black text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-brand-accent transition transform hover:-translate-y-1">
                {loading ? <Loader2 className="animate-spin" /> : <>Submit to MongoDB <Send size={20} /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
