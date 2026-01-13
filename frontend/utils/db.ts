
import { Job, Enquiry } from '../types.ts';

const getApiBase = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  return 'https://dishahire-backend.onrender.com'; // Production default
};

const API_BASE = getApiBase();

const fetcher = async (url: string, options?: RequestInit, fallbackData?: any) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    ...options?.headers,
  };

  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

  try {
    const res = await fetch(fullUrl, { 
      ...options, 
      headers,
      credentials: 'include' // CRITICAL for session persistence
    });
    
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || `Request failed with status ${res.status}`);
    
    return data || fallbackData;
  } catch (err: any) {
    console.error(`📡 Service Access Exception [${fullUrl}]:`, err.message);
    if (fallbackData !== undefined) return fallbackData;
    throw err;
  }
};

export const db = {
  getJobs: (): Promise<Job[]> => fetcher('/api/jobs', {}, []),
  addEnquiry: (enquiry: any): Promise<any> => fetcher('/api/enquiries', { method: 'POST', body: JSON.stringify(enquiry) }),
  getMyApplications: (email?: string): Promise<Enquiry[]> => fetcher(`/api/enquiries/me${email ? `?email=${email}` : ''}`, {}, []),
  getEnquiries: (): Promise<Enquiry[]> => fetcher('/api/admin/enquiries', {}, []),
  getBlogs: (): Promise<any[]> => fetcher('/api/admin/blogs', {}, []),
  deleteJob: (id: string): Promise<void> => fetcher(`/api/jobs/${id}`, { method: 'DELETE' }),
};
