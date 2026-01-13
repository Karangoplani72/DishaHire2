
import { Job, Enquiry, Testimonial, ApplicationStatus } from '../types.ts';

const API_BASE = '/api';

const fetcher = async (url: string, options?: RequestInit, fallbackData?: any) => {
  const token = localStorage.getItem('dh_access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
    
    if (res.status === 401) {
      localStorage.removeItem('dh_access_token');
      if (!window.location.hash.includes('login')) {
         window.location.hash = '/login';
      }
      throw new Error('Unauthorized');
    }

    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);
    
    return data || fallbackData;
  } catch (err: any) {
    console.error(`DB Fetch Error [${url}]:`, err.message);
    if (fallbackData !== undefined) return fallbackData;
    throw err;
  }
};

export const db = {
  getJobs: (): Promise<Job[]> => fetcher('/jobs', {}, []),
  addJob: (job: any): Promise<Job> => fetcher('/jobs', { method: 'POST', body: JSON.stringify(job) }),
  deleteJob: (id: string): Promise<void> => fetcher(`/jobs/${id}`, { method: 'DELETE' }),
  getEnquiries: (): Promise<Enquiry[]> => fetcher('/enquiries', {}, []),
  getMyApplications: (email: string): Promise<Enquiry[]> => fetcher(`/enquiries?email=${email}`, {}, []),
  addEnquiry: (enquiry: any): Promise<any> => fetcher('/enquiries', { method: 'POST', body: JSON.stringify(enquiry) }),
  updateEnquiryStatus: (id: string, status: ApplicationStatus): Promise<Enquiry> => 
    fetcher(`/enquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getTestimonials: (): Promise<Testimonial[]> => fetcher('/testimonials', {}, []),
  getAdminTestimonials: (): Promise<Testimonial[]> => fetcher('/admin/testimonials', {}, []),
  moderateTestimonial: (id: string, update: any): Promise<any> => fetcher(`/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(update) }),
  // Added missing getBlogs method to resolve "Property 'getBlogs' does not exist" error in Career and AdminDashboard pages
  getBlogs: (): Promise<any[]> => fetcher('/blogs', {}, []),
  subscribeNewsletter: (email: string): Promise<void> => fetcher('/subscribers', { method: 'POST', body: JSON.stringify({ email }) }),
};
