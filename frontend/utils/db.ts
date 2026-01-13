
import { Job, Enquiry, ApplicationStatus } from '../types';

const getApiUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  return envUrl ? (envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl) : '';
};
const API_BASE = getApiUrl();

const fetcher = async (url: string, options?: RequestInit, fallbackData?: any) => {
  const token = localStorage.getItem('dh_token');
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

  try {
    const res = await fetch(fullUrl, { ...options, headers });
    
    if (res.status === 401) {
      localStorage.removeItem('dh_token');
      if (!window.location.hash.includes('login')) {
         window.location.hash = '#/login';
      }
      throw new Error('Identity verification required');
    }

    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || `API responded with status ${res.status}`);
    
    return data || fallbackData;
  } catch (err: any) {
    console.error(`📡 Service Link Interrupted [${fullUrl}]:`, err.message);
    if (fallbackData !== undefined) return fallbackData;
    throw err;
  }
};

export const db = {
  getJobs: (): Promise<Job[]> => fetcher('/api/jobs', {}, []),
  // Added deleteJob to fix compilation error in AdminDashboard.tsx
  deleteJob: (id: string): Promise<void> => fetcher(`/api/jobs/${id}`, { method: 'DELETE' }),
  getEnquiries: (): Promise<Enquiry[]> => fetcher('/api/enquiries', {}, []),
  addEnquiry: (enquiry: any): Promise<any> => fetcher('/api/enquiries', { method: 'POST', body: JSON.stringify(enquiry) }),
  getMyApplications: (): Promise<Enquiry[]> => fetcher('/api/enquiries', {}, []),
  // Added getBlogs to fix compilation error in AdminDashboard.tsx and Career.tsx
  getBlogs: (): Promise<any[]> => fetcher('/api/blogs', {}, []),
  subscribeNewsletter: (email: string): Promise<void> => fetcher('/api/subscribers', { method: 'POST', body: JSON.stringify({ email }) }),
};
