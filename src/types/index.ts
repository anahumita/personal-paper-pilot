export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  fields: string[];
}

export interface ContractData {
  templateId: string;
  name: string;
  date: string;
  value: string;
  service: string;
  signatureUrl?: string;
  [key: string]: string | undefined;
}

export interface Document {
  id: string;
  userId: string;
  templateId: string;
  name: string;
  createdAt: string;
  data: ContractData;
  signed: boolean;
}
