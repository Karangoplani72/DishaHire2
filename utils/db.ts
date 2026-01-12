
import { Job, Enquiry, Testimonial } from '../types';

const API_BASE = '/api';

const fetcher = async (url: string, options?: RequestInit, fallbackData?: any) => {
  const token = localStorage.getItem('dh_admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers
    });
    
    if (!res.ok) {
      if (fallbackData) return fallbackData;
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.error || `API Error: ${res.statusText}`);
    }
    
    const data = await res.json();
    return (data && data.length > 0) ? data : (fallbackData || data);
  } catch (err) {
    if (fallbackData) return fallbackData;
    throw err;
  }
};

export const db = {
  getJobs: async (): Promise<Job[]> => fetcher('/jobs'),
  
  addJob: async (job: Omit<Job, 'id' | 'postedDate'>): Promise<Job> => {
    return fetcher('/jobs', { method: 'POST', body: JSON.stringify(job) });
  },
  
  deleteJob: async (id: string): Promise<void> => {
    return fetcher(`/jobs/${id}`, { method: 'DELETE' });
  },

  getEnquiries: async (): Promise<Enquiry[]> => fetcher('/enquiries'),
  
  addEnquiry: async (enquiry: any): Promise<Enquiry> => {
    return fetcher('/enquiries', { method: 'POST', body: JSON.stringify(enquiry) });
  },
  
  updateEnquiryStatus: async (id: string, status: string): Promise<Enquiry> => {
    return fetcher(`/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  },

  // Fix: Added subscribeNewsletter method to resolve missing property error in App.tsx
  subscribeNewsletter: async (email: string): Promise<void> => {
    return fetcher('/subscribers', { method: 'POST', body: JSON.stringify({ email }) });
  },

  // Fix: Added getSubscribers method to resolve missing property error in AdminDashboard.tsx
  getSubscribers: async (): Promise<any[]> => fetcher('/subscribers'),

  getTestimonials: async (): Promise<Testimonial[]> => {
    return [
      { 
        id: '1', 
        name: 'Rajesh Kumar', 
        role: 'HR Director', 
        company: 'FinCorp', 
        content: 'Finding a consultancy that understands Quality over Quantity is rare. DishaHire consistently provides candidates who are not just technically sound but also culturally aligned.', 
        rating: 5, 
        isApproved: true, 
        adminReply: 'Thank you for the trust, Rajesh.' 
      }
    ];
  }
};
