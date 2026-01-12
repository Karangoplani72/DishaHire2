
export enum EnquiryType {
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER'
}

export type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'INTERVIEWING' | 'SHORTLISTED' | 'OFFERED' | 'REJECTED' | 'ARCHIVED';

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
  subject?: string; // Explicitly track the job title or inquiry subject
  name: string;
  email: string;
  message: string;
  status: ApplicationStatus;
  company?: string;
  priority?: string;
  experience?: string;
  resumeData?: string;
  resumeName?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  isApproved: boolean;
}
