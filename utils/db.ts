
const getApiBase = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  return 'https://dishahire-backend.onrender.com'; 
};

const API_BASE = getApiBase();

const fetcher = async (url: string, options?: RequestInit) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...options?.headers,
  };

  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

  try {
    const res = await fetch(fullUrl, { ...options, headers });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || `Request failed with status ${res.status}`);
    return data;
  } catch (err: any) {
    console.error(`📡 Service Access Exception [${fullUrl}]:`, err.message);
    throw err;
  }
};

export const db = {
  addEnquiry: (enquiry: any): Promise<any> => fetcher('/api/enquiries', { method: 'POST', body: JSON.stringify(enquiry) }),
  // Added missing data retrieval methods
  getJobs: (): Promise<any[]> => fetcher('/api/jobs'),
  getEnquiries: (): Promise<any[]> => fetcher('/api/enquiries'),
  getBlogs: (): Promise<any[]> => fetcher('/api/blogs'),
  getMyApplications: (email: string): Promise<any[]> => fetcher(`/api/enquiries/my?email=${email}`),
};
