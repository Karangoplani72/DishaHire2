
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

export interface Job {
  id: string;
  title: string;
  education: string;
  gender: string;
  salary: string;
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
