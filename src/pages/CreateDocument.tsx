
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DocumentForm } from "@/components/documents/DocumentForm";
import { Template, ContractData, Document } from "@/types";
import { TEMPLATES, generateId } from "@/lib/data";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateDocumentProps {
  userId: string;
  onDocumentCreated: (document: Document) => void;
}

export default function CreateDocument({ userId, onDocumentCreated }: CreateDocumentProps) {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [error, setError] = useState("");
  
  useEffect(() => {
    // Find the template by ID
    if (templateId) {
      const foundTemplate = TEMPLATES.find(t => t.id === templateId);
      if (foundTemplate) {
        setTemplate(foundTemplate);
      } else {
        setError("Template not found");
      }
    }
  }, [templateId]);
  
  const handleSubmit = (data: ContractData) => {
    if (!template) return;
    
    // Create a new document
    const newDocument: Document = {
      id: generateId(),
      userId,
      templateId: template.id,
      name: data.name,
      createdAt: new Date().toISOString(),
      data,
      signed: false,
    };
    
    onDocumentCreated(newDocument);
    navigate(`/documents/${newDocument.id}/sign`);
  };
  
  if (error) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!templateId) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Create Document</h1>
        <p>Please select a template to continue.</p>
      </div>
    );
  }
  
  if (!template) {
    return (
      <div className="container py-8">
        <div className="h-40 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading template...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <DocumentForm template={template} onSubmit={handleSubmit} />
    </div>
  );
}
