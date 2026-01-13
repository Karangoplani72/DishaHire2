
import { Job, Enquiry, ApplicationStatus } from '../types';

/**
 * PRODUCTION URL LOGIC:
 * When deployed on Render as separate services, the frontend MUST point
 * to the Backend's absolute URL (e.g. https://dishahire-api.onrender.com).
 * This is passed via VITE_API_URL in the Render dashboard.
 */
const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

// Clean the base URL to ensure it doesn't end with a slash for consistent joining
const cleanBase = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;

const fetcher = async (url: string, options?: RequestInit, fallbackData?: any) => {
  const token = localStorage.getItem('dh_access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  const fullUrl = url.startsWith('http') ? url : `${cleanBase}${url}`;

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers
    });
    
    if (res.status === 401) {
      localStorage.removeItem('dh_access_token');
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
    console.error(`📡 Network Error [${fullUrl}]:`, err.message);
    if (fallbackData !== undefined) return fallbackData;
    throw err;
  }
};

export const db = {
  getJobs: async (): Promise<Job[]> => fetcher('/api/jobs', {}, []),
  addJob: async (job: any): Promise<Job> => fetcher('/api/jobs', { method: 'POST', body: JSON.stringify(job) }),
  deleteJob: async (id: string): Promise<void> => fetcher(`/api/jobs/${id}`, { method: 'DELETE' }),
  getEnquiries: async (): Promise<Enquiry[]> => fetcher('/api/enquiries', {}, []),
  getMyApplications: async (email: string): Promise<Enquiry[]> => fetcher(`/api/enquiries?email=${email}`, {}, []),
  addEnquiry: async (enquiry: any): Promise<any> => fetcher('/api/enquiries', { method: 'POST', body: JSON.stringify(enquiry) }),
  updateEnquiryStatus: async (id: string, status: ApplicationStatus): Promise<Enquiry> => {
    return fetcher(`/api/enquiries/${id}/status`, { 
      method: 'PATCH', 
      body: JSON.stringify({ status }) 
    });
  },
  getBlogs: async (): Promise<any[]> => fetcher('/api/blogs', {}, []),
  subscribeNewsletter: async (email: string): Promise<void> => fetcher('/api/subscribers', { method: 'POST', body: JSON.stringify({ email }) }),
};
