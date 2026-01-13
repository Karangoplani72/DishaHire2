
import { Job, Enquiry, ApplicationStatus } from '../types.ts';

/**
 * DETECT API BASE URL
 * In production, the backend lives on a different domain.
 * We must use an absolute URL provided via VITE_API_URL.
 */
const getApiBase = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  
  // Fallback for local development if proxy is used
  return ''; 
};

const API_BASE = getApiBase();

const fetcher = async (url: string, options?: RequestInit, fallbackData?: any) => {
  const token = localStorage.getItem('dh_access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

  try {
    const res = await fetch(fullUrl, { ...options, headers });
    
    if (res.status === 401) {
      localStorage.removeItem('dh_access_token');
      if (!window.location.hash.includes('login')) {
         window.location.hash = '#/login';
      }
      throw new Error('Unauthorized');
    }

    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || `Server responded with ${res.status}`);
    
    return data || fallbackData;
  } catch (err: any) {
    console.error(`📡 Connectivity Error [${fullUrl}]:`, err.message);
    // Rethrow to allow UI to handle the "Network failure" display
    throw new Error(err.message === 'Failed to fetch' ? 'Unable to connect to the DishaHire API server. Please check your internet or contact support.' : err.message);
  }
};

export const db = {
  getJobs: (): Promise<Job[]> => fetcher('/api/jobs', {}, []),
  addJob: (job: any): Promise<Job> => fetcher('/api/jobs', { method: 'POST', body: JSON.stringify(job) }),
  deleteJob: (id: string): Promise<void> => fetcher(`/api/jobs/${id}`, { method: 'DELETE' }),
  getEnquiries: (): Promise<Enquiry[]> => fetcher('/api/enquiries', {}, []),
  // Fixed: Made email parameter optional to support both direct email lookup and token-based /me endpoint
  getMyApplications: (email?: string): Promise<Enquiry[]> => fetcher(email ? `/api/enquiries?email=${email}` : '/api/enquiries', {}, []),
  addEnquiry: (enquiry: any): Promise<any> => fetcher('/api/enquiries', { method: 'POST', body: JSON.stringify(enquiry) }),
  updateEnquiryStatus: (id: string, status: ApplicationStatus): Promise<Enquiry> => 
    fetcher(`/api/enquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getBlogs: (): Promise<any[]> => fetcher('/api/blogs', {}, []),
  subscribeNewsletter: (email: string): Promise<void> => fetcher('/api/subscribers', { method: 'POST', body: JSON.stringify({ email }) }),
};
