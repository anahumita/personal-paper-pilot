import { Template, Document } from "@/types";

export const TEMPLATES: Template[] = [
  {
    id: "freelance-agreement",
    name: "Freelance Agreement",
    description: "Contract for freelance work and services",
    imageUrl: "/placeholder.svg",
    fields: ["freelancerName", "clientName", "projectScope", "rate", "paymentTerms", "startDate", "duration"],
  },
  {
    id: "recruitment-contract",
    name: "Employment Contract",
    description: "Standard employment agreement for full-time positions",
    imageUrl: "/placeholder.svg",
    fields: ["employeeName", "employerName", "position", "salary", "startDate", "benefits", "workHours"],
  },
  {
    id: "contractor-agreement",
    name: "Independent Contractor Agreement",
    description: "Agreement for independent contractors and companies",
    imageUrl: "/placeholder.svg",
    fields: ["contractorName", "companyName", "service", "rate", "paymentSchedule", "deliverables", "term"],
  },
  {
    id: "consulting-agreement",
    name: "Consulting Agreement",
    description: "Professional consulting services contract",
    imageUrl: "/placeholder.svg",
    fields: ["consultantName", "clientName", "scope", "fee", "duration", "terms", "deliverables"],
  }
];

// Mock user documents
export const MOCK_DOCUMENTS: Document[] = [
  {
    id: "doc-1",
    userId: "user-1",
    templateId: "service-agreement",
    name: "Website Development Agreement",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    data: {
      templateId: "service-agreement",
      name: "Website Development Agreement",
      date: "2023-04-15",
      value: "$5,000",
      service: "Website Development",
      clientName: "Acme Corp",
      providerName: "Web Wizards LLC",
      duration: "45 days",
    },
    signed: true,
  },
  {
    id: "doc-2",
    userId: "user-1",
    templateId: "nda",
    name: "Project X Non-Disclosure",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    data: {
      templateId: "nda",
      name: "Project X Non-Disclosure",
      date: "2023-03-20",
      value: "",
      service: "",
      partyName: "John Smith",
      companyName: "Acme Corp",
      purpose: "Software Development Collaboration",
      duration: "2 years",
    },
    signed: false,
  },
];

// Helper function to generate document ID
export function generateId(prefix: string = "doc"): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}
