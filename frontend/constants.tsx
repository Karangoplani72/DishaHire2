
export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
];

export const CONTACT_INFO = {
  email: 'dishahire.0818@gmail.com',
  phone: '+91 84879 98492',
  whatsapp: 'https://wa.me/918487998492',
  linkedin: 'https://www.linkedin.com/in/sandhya-tekwani-711123274',
  instagram: 'https://www.instagram.com/disha_hire_0818',
  address: 'Rajkot, Gujarat'
};

export const INDUSTRIES = [
  'IT & Technology',
  'BPO & Customer Support',
  'Manufacturing',
  'Sales & Marketing',
  'Healthcare',
  'Finance & Accounts'
];

export const COMMERCIAL_TERMS = [
  { level: 'Consultation', range: 'Standard Service', charges: 'Inquire for Quote' },
];

/**
 * Accesses the VITE_API_URL from Render's Frontend Environment Variables.
 * Falls back to a hardcoded URL or empty string for local development.
 */
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? '' 
    : 'https://dishahire-backend.onrender.com');
