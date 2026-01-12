
import { Job, Enquiry, Testimonial } from '../types';

// IMPORTANT: Set VITE_API_URL in Render Static Site env vars (e.g., https://your-backend.onrender.com/api)
const API_BASE = (window as any).VITE_API_URL || 'http://localhost:3001/api';

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
    return data;
  } catch (err) {
    if (fallbackData) return fallbackData;
    throw err;
  }
};

export const db = {
  getJobs: async (): Promise<Job[]> => fetcher('/jobs', {}, []),
  addJob: async (job: any): Promise<Job> => fetcher('/jobs', { method: 'POST', body: JSON.stringify(job) }),
  deleteJob: async (id: string): Promise<void> => fetcher(`/jobs/${id}`, { method: 'DELETE' }),
  getEnquiries: async (): Promise<Enquiry[]> => fetcher('/enquiries', {}, []),
  addEnquiry: async (enquiry: any): Promise<Enquiry> => fetcher('/enquiries', { method: 'POST', body: JSON.stringify(enquiry) }),
  subscribeNewsletter: async (email: string): Promise<void> => fetcher('/subscribers', { method: 'POST', body: JSON.stringify({ email }) }),
  getSubscribers: async (): Promise<any[]> => fetcher('/subscribers', {}, []),
  getTestimonials: async (): Promise<Testimonial[]> => {
    return [
      { 
        id: '1', 
        name: 'Rajesh Kumar', 
        role: 'HR Director', 
        company: 'FinCorp', 
        content: 'Exceptional quality and alignment.', 
        rating: 5, 
        isApproved: true 
      }
    ];
  }
};
