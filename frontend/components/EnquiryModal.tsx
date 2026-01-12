
import React, { useState } from 'react';
import { X, Send, User, MapPin, Loader2 } from 'lucide-react';
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
        company: formData.get('company'),
        priority: formData.get('priority') === 'High Priority' ? 'HIGH' : 'NORMAL',
        experience: formData.get('experience'),
        resumeName: file?.name,
        resumeData
      };
      await db.addEnquiry(enquiryData);
      alert('Enquiry submitted successfully.');
      onClose();
    } catch (err) {
      alert('Submission failed. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden relative z-10 p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-brand-dark">
          <X size={24} />
        </button>
        <h3 className="text-3xl font-serif font-bold mb-6 text-brand-dark">
          {type === EnquiryType.CANDIDATE ? 'Candidate Enquiry' : 'Employer Enquiry'}
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Name</label>
              <input required name="name" className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Email</label>
              <input required name="email" type="email" className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" />
            </div>
          </div>
          {type === EnquiryType.EMPLOYER && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required name="company" className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="Company Name" />
              <select name="priority" className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none">
                <option>Standard</option>
                <option>High Priority</option>
              </select>
            </div>
          )}
          {type === EnquiryType.CANDIDATE && (
            <input required name="experience" className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="Years of Experience" />
          )}
          <textarea name="message" rows={3} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="Your Message"></textarea>
          {type === EnquiryType.CANDIDATE && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Resume (PDF)</label>
              <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full text-sm" />
              {fileError && <p className="text-red-500 text-[10px]">{fileError}</p>}
            </div>
          )}
          <button disabled={loading} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <>Submit Enquiry <Send size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
