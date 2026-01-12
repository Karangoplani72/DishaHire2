
import React, { useState } from 'react';
import { X, Send, User, MapPin, Loader2, Building, Briefcase } from 'lucide-react';
import { EnquiryType } from '../types.ts';
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
      if (file) resumeData = await toBase64(file);
      
      const enquiryData = {
        type,
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        company: formData.get('company') || '',
        priority: formData.get('priority') === 'High Priority' ? 'HIGH' : 'NORMAL',
        experience: formData.get('experience') || '',
        resumeName: file?.name || '',
        resumeData
      };
      
      await db.addEnquiry(enquiryData);
      alert('Enquiry transmitted successfully. Our team will review your details.');
      onClose();
    } catch (err) {
      alert('Transmission failed. Please check your connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl">
        <div className="bg-brand-dark p-8 text-white relative">
           <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-all">
            <X size={28} />
          </button>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-2">Secure Inquiry</div>
          <h3 className="text-3xl font-serif font-bold">
            {type === EnquiryType.CANDIDATE ? 'Professional Direction' : 'Talent Partnership'}
          </h3>
        </div>
        
        <form className="p-10 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input required name="name" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-serif" placeholder="e.g. Rahul Verma" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Professional Email</label>
              <input required name="email" type="email" className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-serif" placeholder="email@example.com" />
            </div>
          </div>

          {type === EnquiryType.EMPLOYER && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Organization</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required name="company" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-serif" placeholder="Company Name" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Priority Level</label>
                <select name="priority" className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none font-bold text-brand-dark">
                  <option>Standard Engagement</option>
                  <option>High Priority</option>
                </select>
              </div>
            </div>
          )}

          {type === EnquiryType.CANDIDATE && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Experience Profile</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input required name="experience" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-serif" placeholder="e.g. 8+ Years, Senior Architect" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Strategic Message</label>
            <textarea name="message" rows={3} className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all resize-none font-serif" placeholder="Briefly describe your requirements..."></textarea>
          </div>

          {type === EnquiryType.CANDIDATE && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Executive CV (PDF)</label>
              <div className="relative border-2 border-dashed border-gray-100 bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-all cursor-pointer">
                <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {file ? <span className="text-brand-dark font-bold">{file.name}</span> : <span className="text-gray-400 text-sm">Click to upload your professional CV</span>}
              </div>
              {fileError && <p className="text-red-500 text-[10px] font-bold">{fileError}</p>}
            </div>
          )}

          <button disabled={loading} className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-brand-accent transition-all transform hover:-translate-y-1">
            {loading ? <Loader2 className="animate-spin" /> : <>Submit Inquiry <Send size={20} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
