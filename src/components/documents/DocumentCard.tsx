
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Document } from "@/types";
import { FileText, Download, Pencil, FileSignature } from "lucide-react";

interface DocumentCardProps {
  document: Document;
  onDownload: (document: Document) => void;
}

export function DocumentCard({ document, onDownload }: DocumentCardProps) {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload(document);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-primary mr-2" />
            <CardTitle className="text-lg">{document.name}</CardTitle>
          </div>
          <Badge variant={document.signed ? "default" : "outline"}>
            {document.signed ? "Signed" : "Unsigned"}
          </Badge>
        </div>
        <CardDescription>
          Created on {formatDate(document.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <div className="text-sm text-muted-foreground">
          <div className="mt-2 space-y-1">
            {Object.entries(document.data)
              .filter(([key]) => !['templateId', 'name'].includes(key) && document.data[key])
              .slice(0, 3)
              .map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span>{value}</span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
        <Button 
          size="sm" 
          onClick={() => navigate(`/documents/${document.id}/edit`)}
          className="w-full"
        >
          {document.signed ? (
            <>
              <FileSignature className="h-4 w-4 mr-2" />
              View
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
