
import { Job, Enquiry, Testimonial, ApplicationStatus } from '../types';

const API_BASE = (window as any).VITE_API_URL || 'https://dishahire-backend.onrender.com/api';

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
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.error || `API Error: ${res.statusText}`);
    }
    
    const data = await res.json();
    // VULNERABILITY FIX: Distinguish between 'null/undefined' (error/loading) and '[]' (empty result).
    // An empty array is a valid response and should NOT trigger the fallback.
    return (data !== null && data !== undefined) ? data : fallbackData;
  } catch (err) {
    console.error(`Fetch error for ${url}:`, err);
    if (fallbackData !== undefined) return fallbackData;
    throw err;
  }
};

export const db = {
  getJobs: async (): Promise<Job[]> => fetcher('/jobs', {}, []),
  addJob: async (job: any): Promise<Job> => fetcher('/jobs', { method: 'POST', body: JSON.stringify(job) }),
  deleteJob: async (id: string): Promise<void> => fetcher(`/jobs/${id}`, { method: 'DELETE' }),
  
  getEnquiries: async (): Promise<Enquiry[]> => fetcher('/enquiries', {}, []),
  getMyApplications: async (email: string): Promise<Enquiry[]> => fetcher(`/my-applications?email=${email}`, {}, []),
  
  addEnquiry: async (enquiry: any): Promise<Enquiry> => fetcher('/enquiries', { method: 'POST', body: JSON.stringify(enquiry) }),
  
  updateEnquiryStatus: async (id: string, status: ApplicationStatus): Promise<Enquiry> => {
    return fetcher(`/enquiries/${id}/status`, { 
      method: 'PATCH', 
      body: JSON.stringify({ status }) 
    });
  },

  subscribeNewsletter: async (email: string): Promise<void> => fetcher('/subscribers', { method: 'POST', body: JSON.stringify({ email }) }),
  getSubscribers: async (): Promise<any[]> => fetcher('/subscribers', {}, []),
  getTestimonials: async (): Promise<Testimonial[]> => fetcher('/testimonials', {}, [])
};
