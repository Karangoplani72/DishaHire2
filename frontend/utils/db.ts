
import { Job, Enquiry, Testimonial, ApplicationStatus } from '../types';

// Use environment variable for production API, fallback to relative /api for local proxy
const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

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
      // Using direct window location check to stay compatible with HashRouter or BrowserRouter
      if (!window.location.href.includes('login')) {
         window.location.href = '#/login';
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
  getMyApplications: async (email: string): Promise<Enquiry[]> => fetcher(`/enquiries?email=${email}`, {}, []),
  addEnquiry: async (enquiry: any): Promise<any> => fetcher('/enquiries', { method: 'POST', body: JSON.stringify(enquiry) }),
  updateEnquiryStatus: async (id: string, status: ApplicationStatus): Promise<Enquiry> => {
    return fetcher(`/enquiries/${id}/status`, { 
      method: 'PATCH', 
      body: JSON.stringify({ status }) 
    });
  },
  
  getBlogs: async (): Promise<any[]> => fetcher('/blogs', {}, []),
  addBlog: async (blog: any): Promise<any> => fetcher('/blogs', { method: 'POST', body: JSON.stringify(blog) }),
  deleteBlog: async (id: string): Promise<void> => fetcher(`/blogs/${id}`, { method: 'DELETE' }),

  subscribeNewsletter: async (email: string): Promise<void> => fetcher('/subscribers', { method: 'POST', body: JSON.stringify({ email }) }),
  getSubscribers: async (): Promise<any[]> => fetcher('/subscribers', {}, []),
  
  getTestimonials: async (): Promise<Testimonial[]> => fetcher('/testimonials', {}, []),
  getAdminTestimonials: async (): Promise<Testimonial[]> => fetcher('/admin/testimonials', {}, []),
  moderateTestimonial: async (id: string, update: any): Promise<any> => fetcher(`/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(update) }),
};
