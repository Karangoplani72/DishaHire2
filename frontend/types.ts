
export enum EnquiryType {
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER'
}

export type ApplicationStatus = 'PENDING' | 'REPLIED' | 'REVIEWING' | 'INTERVIEWING' | 'SHORTLISTED' | 'OFFERED' | 'REJECTED' | 'ARCHIVED';

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
  _id?: string;
  id: string;
  type: EnquiryType;
  subject?: string;
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
