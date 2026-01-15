
export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'Contact Us', href: '/contact' },
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
  'Information Technology (IT & Tech)',
  'Healthcare & Life Sciences',
  'Banking, Finance & Insurance (BFSI)',
  'Manufacturing & Engineering',
  'Sales & Marketing',
  'Human Resources & Administration',
  'Retail & E-commerce',
  'Hospitality & Travel',
  'Education & Training',
  'Construction & Real Estate',
  'Telecom & Networking',
  'Media, Advertising & Creative',
  'Logistics & Supply Chain',
  'Energy & Utilities',
  'Startups & MSME’s'
];

export const COMPANY_TYPES = [
  'Private Company',
  'Public Company',
  'NGO',
  'Manufacture',
  'Government',
  'Partnership',
  'Proprietorship',
  'Other'
];

export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? '' 
    : 'https://dishahire-backend.onrender.com');
