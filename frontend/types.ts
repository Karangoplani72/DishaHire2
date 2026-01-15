
export enum EnquiryType {
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER'
}

// Added ApplicationStatus enum for recruitment tracking
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

// Added Job interface for elite opportunities
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  industry: string;
}

export interface Enquiry {
  _id?: string;
  id?: string;
  type?: EnquiryType;
  name: string;
  email: string;
  subject?: string;
  message: string;
  company?: string;
  createdAt: string;
  status?: ApplicationStatus;
}