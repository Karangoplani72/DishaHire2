
export enum EnquiryType {
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER'
}

// Added ApplicationStatus type to resolve import error in utils/db.ts
export type ApplicationStatus = 'PENDING' | 'REPLIED' | 'ARCHIVED' | 'REVIEWING' | 'INTERVIEWING' | 'SHORTLISTED' | 'OFFERED' | 'REJECTED';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  postedDate: string;
  industry: string;
}

export interface Enquiry {
  id: string;
  type: EnquiryType;
  name: string;
  email: string;
  phone: string;
  // Added subject property to resolve Property 'subject' does not exist error in MyApplications.tsx
  subject?: string;
  message: string;
  // Updated status to use ApplicationStatus type
  status: ApplicationStatus;
  priority?: 'NORMAL' | 'HIGH';
  company?: string;
  experience?: string;
  skills?: string;
  createdAt: string;
}

export interface CareerTip {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
}

// Added Testimonial interface to resolve missing exported member error in Home.tsx
export interface Testimonial {
  _id: string;
  name: string;
  company: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}
