
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DocumentForm } from "@/components/documents/DocumentForm";
import { Template, Document } from "@/types";
import { TEMPLATES, MOCK_DOCUMENTS } from "@/lib/data";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditDocumentProps {
  userId: string;
  onDocumentUpdated: (document: Document) => void;
  documents: Document[];
}

export default function EditDocument({ userId, onDocumentUpdated, documents = MOCK_DOCUMENTS }: EditDocumentProps) {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [error, setError] = useState("");
  
  useEffect(() => {
    // Find the document by ID
    if (documentId) {
      const foundDocument = documents.find(d => d.id === documentId);
      if (foundDocument) {
        if (foundDocument.userId !== userId) {
          setError("You don't have permission to edit this document");
          return;
        }
        
        setDocument(foundDocument);
        
        // Find the template for this document
        const foundTemplate = TEMPLATES.find(t => t.id === foundDocument.templateId);
        if (foundTemplate) {
          setTemplate(foundTemplate);
        } else {
          setError("Template not found");
        }
      } else {
        setError("Document not found");
      }
    }
  }, [documentId, userId, documents]);
  
  const handleSubmit = (updatedData: any) => {
    if (!document || !template) return;
    
    // Update the document
    const updatedDocument: Document = {
      ...document,
      name: updatedData.name,
      data: updatedData,
    };
    
    onDocumentUpdated(updatedDocument);
    navigate(`/documents/${updatedDocument.id}/sign`);
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
  
  if (!document || !template) {
    return (
      <div className="container py-8">
        <div className="h-40 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <DocumentForm 
        template={template} 
        initialData={document.data} 
        onSubmit={handleSubmit} 
        isEditing={true} 
      />
    </div>
  );
}
