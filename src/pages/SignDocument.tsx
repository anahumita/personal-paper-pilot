
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Document } from "@/types";
import { SignatureCanvas } from "@/components/documents/SignatureCanvas";
import { PdfPreview } from "@/components/documents/PdfPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MOCK_DOCUMENTS } from "@/lib/data";
import { ArrowLeft, Check, Download, FileCheck } from "lucide-react";

interface SignDocumentProps {
  userId: string;
  onDocumentSigned: (document: Document, signatureUrl: string) => void;
  onDownloadDocument: (document: Document) => Promise<void>;
  documents: Document[];
}

export default function SignDocument({ 
  userId, 
  onDocumentSigned, 
  onDownloadDocument,
  documents = MOCK_DOCUMENTS 
}: SignDocumentProps) {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [error, setError] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Find the document by ID
    if (documentId) {
      const foundDocument = documents.find(d => d.id === documentId);
      if (foundDocument) {
        if (foundDocument.userId !== userId) {
          setError("You don't have permission to access this document");
          return;
        }
        
        setDocument(foundDocument);
        setIsSigned(foundDocument.signed);
      } else {
        setError("Document not found");
      }
    }
  }, [documentId, userId, documents]);
  
  const handleSign = (signatureUrl: string) => {
    if (!document) return;
    
    setIsLoading(true);
    
    // Simulate a network delay
    setTimeout(() => {
      // Update the document with the signature
      const updatedDocument: Document = {
        ...document,
        data: {
          ...document.data,
          signatureUrl
        },
        signed: true
      };
      
      onDocumentSigned(updatedDocument, signatureUrl);
      setDocument(updatedDocument);
      setIsSigned(true);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleDownload = async () => {
    if (!document) return;
    await onDownloadDocument(document);
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
  
  if (!document) {
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
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4"
        onClick={() => navigate("/documents")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Documents
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{document.name}</CardTitle>
              <CardDescription>
                {isSigned 
                  ? "This document has been signed and is ready for download" 
                  : "Review your document before signing"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PdfPreview document={document} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          {isSigned ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <CardTitle>Document Signed</CardTitle>
                </div>
                <CardDescription>
                  Your document has been successfully signed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg flex items-center justify-center flex-col">
                  <div className="flex items-center justify-center bg-primary/10 p-3 rounded-full mb-3">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-center font-medium">Document signed and finalized</p>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    You can now download your document
                  </p>
                </div>
                
                <Button onClick={handleDownload} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/documents")}
                >
                  Return to Documents
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <SignatureCanvas 
                onSigned={handleSign} 
                initialSignature={document.data.signatureUrl} 
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Finalize Document</CardTitle>
                  <CardDescription>
                    Once you've added your signature, you can finalize your document
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    disabled={!document.data.signatureUrl || isLoading} 
                    className="w-full"
                    onClick={() => document.data.signatureUrl && handleSign(document.data.signatureUrl)}
                  >
                    {isLoading ? "Processing..." : "Finalize Document"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
