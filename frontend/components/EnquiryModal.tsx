
import React, { useState } from 'react';
import { X, Send, User, MapPin, Loader2, Building, Briefcase, Mail } from 'lucide-react';
import { EnquiryType } from '../types.ts';
import { db } from '../utils/db.ts';

interface Props {
  type: EnquiryType;
  onClose: () => void;
  initialMessage?: string;
}

const EnquiryModal: React.FC<Props> = ({ type, onClose, initialMessage = '' }) => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white w-full max-w-xl rounded-[2rem] overflow-hidden relative z-10 shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        
        {/* Compact Header */}
        <div className="bg-brand-dark p-6 sm:p-8 text-white relative flex-shrink-0">
           <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-all">
            <X size={24} />
          </button>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-1">Inquiry Form</div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold">
            {type === EnquiryType.CANDIDATE ? 'Professional Direction' : 'Talent Partnership'}
          </h3>
        </div>
        
        {/* Scrollable Form Body */}
        <form className="p-6 sm:p-10 space-y-5 overflow-y-auto" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input required name="name" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm" placeholder="e.g. Rahul Verma" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input required name="email" type="email" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm" placeholder="email@example.com" />
              </div>
            </div>
          </div>

          {type === EnquiryType.EMPLOYER && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Organization</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input required name="company" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm" placeholder="Company Name" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Priority</label>
                <select name="priority" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-brand-gold/30 outline-none font-bold text-brand-dark text-sm">
                  <option>Standard</option>
                  <option>High Priority</option>
                </select>
              </div>
            </div>
          )}

          {type === EnquiryType.CANDIDATE && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Experience Profile</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input required name="experience" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm" placeholder="e.g. 8+ Years, Senior Architect" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Message</label>
            <textarea defaultValue={initialMessage} name="message" rows={2} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all resize-none text-sm" placeholder="Describe your requirements..."></textarea>
          </div>

          {type === EnquiryType.CANDIDATE && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Professional CV (PDF)</label>
              <div className="relative border-2 border-dashed border-gray-100 bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-all cursor-pointer">
                <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {file ? <span className="text-brand-dark font-bold text-xs">{file.name}</span> : <span className="text-gray-400 text-xs">Upload CV</span>}
              </div>
              {fileError && <p className="text-red-500 text-[9px] font-bold">{fileError}</p>}
            </div>
          )}

          <button disabled={loading} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 shadow-xl hover:bg-brand-accent transition-all transform hover:-translate-y-1 mt-4">
            {loading ? <Loader2 className="animate-spin" /> : <>Send Inquiry <Send size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
