
import { Job, Enquiry, Testimonial, ApplicationStatus } from '../types';

const API_BASE = '/api';

const fetcher = async (url: string, options?: RequestInit, fallbackData?: any) => {
  const token = localStorage.getItem('dh_access_token');
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
    
    if (res.status === 401) {
      localStorage.removeItem('dh_access_token');
      if (!window.location.hash.includes('login')) {
         window.location.hash = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.error || `API Error: ${res.statusText}`);
    }
    
    const data = await res.json();
    return (data !== null && data !== undefined) ? data : fallbackData;
  } catch (err: any) {
    if (err.message === 'Unauthorized') throw err;
    console.error(`Network or API failure for ${url}:`, err);
    if (fallbackData !== undefined) return fallbackData;
    throw err;
  }
};

export const db = {
  getJobs: async (): Promise<Job[]> => fetcher('/jobs', {}, []),
  addJob: async (job: any): Promise<Job> => fetcher('/jobs', { method: 'POST', body: JSON.stringify(job) }),
  deleteJob: async (id: string): Promise<void> => fetcher(`/jobs/${id}`, { method: 'DELETE' }),
  getEnquiries: async (): Promise<Enquiry[]> => fetcher('/enquiries', {}, []),
  // Added getMyApplications to resolve missing property error in MyApplications.tsx
  getMyApplications: async (email: string): Promise<Enquiry[]> => fetcher(`/enquiries?email=${email}`, {}, []),
  addEnquiry: async (enquiry: any): Promise<any> => fetcher('/enquiries', { method: 'POST', body: JSON.stringify(enquiry) }),
  updateEnquiryStatus: async (id: string, status: ApplicationStatus): Promise<Enquiry> => {
    return fetcher(`/enquiries/${id}/status`, { 
      method: 'PATCH', 
      body: JSON.stringify({ status }) 
    });
  },
  
  // Added blog methods to resolve AdminDashboard errors
  getBlogs: async (): Promise<any[]> => fetcher('/blogs', {}, []),
  addBlog: async (blog: any): Promise<any> => fetcher('/blogs', { method: 'POST', body: JSON.stringify(blog) }),
  deleteBlog: async (id: string): Promise<void> => fetcher(`/blogs/${id}`, { method: 'DELETE' }),

  subscribeNewsletter: async (email: string): Promise<void> => fetcher('/subscribers', { method: 'POST', body: JSON.stringify({ email }) }),
  getSubscribers: async (): Promise<any[]> => fetcher('/subscribers', {}, []),
  
  // Testimonials and Moderation
  getTestimonials: async (): Promise<Testimonial[]> => {
    // Initial static data; in production this would call fetcher('/testimonials', {}, [])
    return [
      { 
        id: '1', 
        name: 'Rajesh Kumar', 
        role: 'HR Director', 
        company: 'FinCorp', 
        content: 'DishaHire consistently provides candidates who are technically sound and culturally aligned.', 
        rating: 5, 
        isApproved: true 
      }
    ];
  },
  // Added admin testimonial methods to resolve AdminDashboard errors
  getAdminTestimonials: async (): Promise<Testimonial[]> => fetcher('/admin/testimonials', {}, []),
  moderateTestimonial: async (id: string, update: any): Promise<any> => fetcher(`/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(update) }),
};
