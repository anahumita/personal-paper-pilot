import { Template, Document } from "@/types";

export const TEMPLATES: Template[] = [
  {
    id: "freelance-agreement",
    name: "Freelance Agreement",
    description: "Comprehensive contract for freelance work and services",
    imageUrl: "/placeholder.svg",
    fields: [
      "freelancerName",
      "clientName",
      "projectScope",
      "rate",
      "paymentTerms",
      "startDate",
      "duration",
      "deliverables",
      "revisionPolicy",
      "intellectualProperty",
      "confidentialityTerms",
      "terminationClauses",
      "disputeResolution",
      "expenses",
      "insurance"
    ],
  },
  {
    id: "recruitment-contract",
    name: "Employment Contract",
    description: "Detailed employment agreement for full-time positions",
    imageUrl: "/placeholder.svg",
    fields: [
      "employeeName",
      "employerName",
      "position",
      "department",
      "reportingTo",
      "startDate",
      "employmentType",
      "salary",
      "paymentSchedule",
      "workHours",
      "workLocation",
      "probationPeriod",
      "benefits",
      "leavePolicy",
      "performanceReview",
      "noticePeriod",
      "nonCompete",
      "confidentiality"
    ],
  },
  {
    id: "contractor-agreement",
    name: "Independent Contractor Agreement",
    description: "Detailed agreement for independent contractors and companies",
    imageUrl: "/placeholder.svg",
    fields: [
      "contractorName",
      "companyName",
      "service",
      "projectScope",
      "rate",
      "paymentSchedule",
      "startDate",
      "endDate",
      "deliverables",
      "milestones",
      "equipment",
      "expenses",
      "insurance",
      "liabilityTerms",
      "intellectualProperty",
      "confidentiality",
      "terminationTerms",
      "governingLaw"
    ],
  },
  {
    id: "consulting-agreement",
    name: "Consulting Agreement",
    description: "Comprehensive professional consulting services contract",
    imageUrl: "/placeholder.svg",
    fields: [
      "consultantName",
      "clientName",
      "scope",
      "expertise",
      "fee",
      "paymentTerms",
      "expenses",
      "startDate",
      "duration",
      "deliverables",
      "performanceMetrics",
      "reportingRequirements",
      "confidentiality",
      "intellectualProperty",
      "nonCompete",
      "terminationClauses",
      "limitationOfLiability",
      "insurance"
    ],
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
