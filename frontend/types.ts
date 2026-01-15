
export enum EnquiryType {
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER'
}

export interface Job {
  id?: string;
  _id?: string;
  title: string;
  education: string;
  gender: string;
  salary: string;
  industry: string;
  location: string;
  otherInfo?: string;
  isArchived: boolean;
  createdAt: string;
}

export interface Enquiry {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  message: string;
  company?: string;
  createdAt: string;
}
