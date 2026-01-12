
import { Job, Enquiry, Testimonial } from '../types';

const API_BASE = '/api';

/**
 * Production-ready fetcher for MongoDB Atlas integration.
 * Strictly communicates with the backend API.
 */
const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    }
  });
  
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `API request failed: ${res.statusText}`);
  }
  
  return res.json();
};

export const db = {
  // JOBS
  getJobs: async (): Promise<Job[]> => {
    return fetcher('/jobs');
  },
  
  addJob: async (job: Omit<Job, 'id' | 'postedDate'>): Promise<Job> => {
    return fetcher('/jobs', { 
      method: 'POST', 
      body: JSON.stringify(job) 
    });
  },
  
  deleteJob: async (id: string): Promise<void> => {
    return fetcher(`/jobs/${id}`, { 
      method: 'DELETE' 
    });
  },

  // ENQUIRIES
  getEnquiries: async (): Promise<Enquiry[]> => {
    return fetcher('/enquiries');
  },
  
  addEnquiry: async (enquiry: any): Promise<Enquiry> => {
    return fetcher('/enquiries', { 
      method: 'POST', 
      body: JSON.stringify(enquiry) 
    });
  },
  
  updateEnquiryStatus: async (id: string, status: string): Promise<Enquiry> => {
    return fetcher(`/enquiries/${id}`, { 
      method: 'PATCH', 
      body: JSON.stringify({ status }) 
    });
  },
  
  deleteEnquiry: async (id: string): Promise<void> => {
    return fetcher(`/enquiries/${id}`, { 
      method: 'DELETE' 
    });
  },

  // NEWSLETTER
  subscribeNewsletter: async (email: string): Promise<any> => {
    return fetcher('/newsletter', { 
      method: 'POST', 
      body: JSON.stringify({ email }) 
    });
  },
  
  getSubscribers: async (): Promise<any[]> => {
    return fetcher('/newsletter');
  },

  // TESTIMONIALS
  getTestimonials: async (): Promise<Testimonial[]> => {
    // In production, this would be a DB fetch. Currently using a vetted static set.
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
