
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Template, ContractData } from "@/types";
import { FileText, ArrowLeft } from "lucide-react";

interface DocumentFormProps {
  template: Template;
  initialData?: ContractData;
  onSubmit: (data: ContractData) => void;
  isEditing?: boolean;
}

export function DocumentForm({ template, initialData, onSubmit, isEditing = false }: DocumentFormProps) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form data from initialData or with empty values for the template fields
  const [formData, setFormData] = useState<Record<string, string>>({
    templateId: template.id,
    name: "",
    ...Object.fromEntries(template.fields.map(field => [field, ""]))
  });

  // When initialData changes, update the form
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.name.trim()) {
        throw new Error("Document name is required");
      }

      // Check required fields based on template
      const missingFields = template.fields.filter(field => 
        !formData[field] || formData[field].trim() === ""
      );

      if (missingFields.length > 0) {
        throw new Error(`Please fill in the following required fields: ${missingFields
          .map(f => f.replace(/([A-Z])/g, ' $1').trim())
          .join(", ")}`);
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onSubmit(formData as ContractData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>{isEditing ? "Edit Document" : "Create New Document"}</CardTitle>
          </div>
          <CardDescription>
            Fill in the details to {isEditing ? "update your" : "create a"} {template.name.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="document-form" onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Document Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter a name for this document" 
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </div>
              
              {template.fields.map(field => {
                // Determine if this is a multi-line text field
                const isMultiline = field === "service" || field.includes("description") || field.includes("purpose");
                
                const fieldLabel = field
                  .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
                  .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
                  
                return isMultiline ? (
                  <div key={field}>
                    <Label htmlFor={field}>{fieldLabel}</Label>
                    <Textarea 
                      id={field} 
                      placeholder={`Enter ${fieldLabel.toLowerCase()}`}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                ) : (
                  <div key={field}>
                    <Label htmlFor={field}>{fieldLabel}</Label>
                    <Input 
                      id={field} 
                      placeholder={`Enter ${fieldLabel.toLowerCase()}`}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      type={field.includes("date") ? "date" : "text"}
                    />
                  </div>
                );
              })}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            form="document-form"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isEditing ? "Saving..." : "Creating...") 
              : (isEditing ? "Save Document" : "Create Document")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
