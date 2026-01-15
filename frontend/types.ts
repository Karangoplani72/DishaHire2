
export enum EnquiryType {
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER'
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REPLIED = 'REPLIED',
  REVIEWING = 'REVIEWING',
  INTERVIEWING = 'INTERVIEWING',
  SHORTLISTED = 'SHORTLISTED',
  OFFERED = 'OFFERED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED'
}

export interface Enquiry {
  _id?: string;
  id?: string;
  type?: EnquiryType;
  name: string;
  email: string;
  message: string;
  subject?: string;
  company?: string;
  status?: ApplicationStatus | string;
  priority?: 'HIGH' | 'NORMAL';
  experience?: string;
  resumeName?: string;
  resumeData?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  industry: string;
  createdAt?: string;
}
