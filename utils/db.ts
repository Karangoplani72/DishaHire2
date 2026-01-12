
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
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
    if (res.status === 401) {
      localStorage.removeItem('dh_access_token');
      throw new Error('Unauthorized');
    }
    const data = await res.json();
    return res.ok ? data : fallbackData;
  } catch (err) {
    return fallbackData;
  }
};

export const db = {
  getJobs: () => fetcher('/jobs', {}, []),
  addJob: (job: any) => fetcher('/jobs', { method: 'POST', body: JSON.stringify(job) }),
  deleteJob: (id: string) => fetcher(`/jobs/${id}`, { method: 'DELETE' }),
  
  getEnquiries: () => fetcher('/enquiries', {}, []),
  addEnquiry: (enq: any) => fetcher('/enquiries', { method: 'POST', body: JSON.stringify(enq) }),
  getMyApplications: (email: string) => fetcher(`/enquiries?email=${email}`, {}, []),
  
  getBlogs: () => fetcher('/blogs', {}, []),
  addBlog: (blog: any) => fetcher('/blogs', { method: 'POST', body: JSON.stringify(blog) }),
  deleteBlog: (id: string) => fetcher(`/blogs/${id}`, { method: 'DELETE' }),

  getTestimonials: () => fetcher('/testimonials', {}, []),
  getAdminTestimonials: () => fetcher('/admin/testimonials', {}, []),
  submitFeedback: (fb: any) => fetcher('/testimonials', { method: 'POST', body: JSON.stringify(fb) }),
  moderateTestimonial: (id: string, update: any) => fetcher(`/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(update) }),

  subscribeNewsletter: (email: string) => fetcher('/subscribers', { method: 'POST', body: JSON.stringify({ email }) }),
  getSubscribers: () => fetcher('/subscribers', {}, [])
};
