
import React, { useState } from 'react';
import { X, Send, User, MapPin, Loader2, Building, Briefcase, Mail, AlertCircle } from 'lucide-react';
import { EnquiryType } from '../types.ts';
import { db } from '../utils/db.ts';

interface Props {
  type: EnquiryType;
  onClose: () => void;
  initialMessage?: string;
  initialSubject?: string;
}

const EnquiryModal: React.FC<Props> = ({ type, onClose, initialMessage = '', initialSubject = 'General Inquiry' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError('');
    if (selectedFile) {
      // SECURITY & PRODUCTION FIX: Check file size limit (10MB) before processing.
      // Base64 encoding increases file size by ~33%, so 10MB becomes ~13.3MB.
      // This stays safely within MongoDB's 16MB limit.
      if (selectedFile.size > 10 * 1024 * 1024) {
        setFileError('File exceeds 10MB security limit.');
        setFile(null);
        return;
      }
      if (selectedFile.type !== 'application/pdf') {
        setFileError('Only professional PDF documents are accepted.');
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
      setFileError('Curriculum Vitae (PDF) is required.');
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
        subject: formData.get('subject') || initialSubject,
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
      alert('Your inquiry has been successfully transmitted to our consultants.');
      onClose();
    } catch (err: any) {
      alert(err.message || 'Network error. Data transmission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        
        <div className="bg-brand-dark p-6 sm:p-10 text-white relative flex-shrink-0">
           <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-all">
            <X size={28} />
          </button>
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold mb-2">Secure Link Gateway</div>
          <h3 className="text-3xl sm:text-4xl font-serif font-bold">
            {type === EnquiryType.CANDIDATE ? 'Professional Direction' : 'Strategic Partnership'}
          </h3>
        </div>
        
        <form className="p-6 sm:p-10 space-y-6 overflow-y-auto" onSubmit={handleSubmit}>
          <input type="hidden" name="subject" value={initialSubject} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input required name="name" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm font-medium" placeholder="Legal Name" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input required name="email" type="email" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm font-medium" placeholder="Professional Email" />
              </div>
            </div>
          </div>

          {type === EnquiryType.EMPLOYER ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Organization</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required name="company" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm font-medium" placeholder="Company Name" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Urgency</label>
                <select name="priority" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none font-bold text-brand-dark text-sm appearance-none cursor-pointer">
                  <option>Standard</option>
                  <option>High Priority</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Profile</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input required name="experience" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm font-medium" placeholder="e.g. 5 Years, Senior Product Manager" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Message / Requirements</label>
            <textarea defaultValue={initialMessage} name="message" rows={4} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all resize-none text-sm leading-relaxed font-medium" placeholder="Elaborate on your inquiry..."></textarea>
          </div>

          {type === EnquiryType.CANDIDATE && (
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Resume Upload (PDF &lt; 10MB)</label>
              <div className={`relative border-2 border-dashed ${fileError ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'} rounded-[2rem] p-10 text-center hover:border-brand-gold/40 hover:bg-white transition-all cursor-pointer`}>
                <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <Send className="text-brand-gold" size={20} />
                    <span className="text-brand-dark font-black text-sm">{file.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm font-serif italic">Select professional PDF file...</span>
                )}
              </div>
              {fileError && (
                <div className="flex items-center justify-center gap-2 text-red-500">
                  <AlertCircle size={14} />
                  <p className="text-[10px] font-black uppercase tracking-widest">{fileError}</p>
                </div>
              )}
            </div>
          )}

          <button disabled={loading} className="w-full bg-brand-dark text-white py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-4 shadow-2xl hover:bg-brand-accent transition-all transform hover:-translate-y-1 mt-6 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <>Complete Submission <Send size={22} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
