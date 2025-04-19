
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Template, ContractData } from "@/types";
import { FileText, ArrowLeft, Calendar as CalendarIcon, ListCheck, AlertTriangle } from "lucide-react";

interface DocumentFormProps {
  template: Template;
  initialData?: ContractData;
  onSubmit: (data: ContractData) => void;
  isEditing?: boolean;
}

const SUGGESTIONS = {
  currency: ["USD", "EUR", "GBP", "CAD", "AUD"],
  paymentFrequency: ["Weekly", "Bi-weekly", "Monthly", "Quarterly"],
  jurisdiction: ["California, USA", "New York, USA", "London, UK", "Ontario, Canada"],
  governingLaw: ["California Law", "New York Law", "English Law", "Ontario Law"],
  confidentialityObligations: [
    "All information shared during the engagement is strictly confidential",
    "Parties agree to maintain confidentiality for 5 years after termination",
    "Standard NDA terms apply to all confidential information"
  ],
  disputeResolution: [
    "Arbitration in accordance with ICC rules",
    "Mediation followed by binding arbitration",
    "Local courts with exclusive jurisdiction"
  ]
};

const isDateField = (field: string) => 
  field.toLowerCase().includes('date') || 
  field.toLowerCase().includes('started') || 
  field.toLowerCase().includes('ended') ||
  field.toLowerCase().includes('period');

const isCheckboxField = (field: string) =>
  field.startsWith('has') || 
  field.startsWith('is') ||
  field.toLowerCase().includes('agreed') ||
  field.toLowerCase().includes('accepted');

const getSuggestions = (field: string): string[] => {
  const key = field as keyof typeof SUGGESTIONS;
  return SUGGESTIONS[key] || [];
};

export function DocumentForm({ template, initialData, onSubmit, isEditing = false }: DocumentFormProps) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [incompleteFields, setIncompleteFields] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("essential");
  
  const [formData, setFormData] = useState<Record<string, any>>({
    templateId: template.id,
    name: "",
    ...Object.fromEntries(template.fields.map(field => [
      field, 
      isCheckboxField(field) ? false : ""
    ]))
  });

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

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: date ? format(date, "yyyy-MM-dd") : ""
    }));
  };

  const handleSuggestionClick = (field: string, suggestion: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: suggestion
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!formData.name.trim()) {
        throw new Error("Document name is required");
      }

      const incomplete = template.fields.filter(field => 
        !formData[field] || formData[field].trim() === ""
      );
      
      setIncompleteFields(incomplete);

      const filledData = { ...formData };
      incomplete.forEach(field => {
        if (!filledData[field] || filledData[field].trim() === "") {
          filledData[field] = `[${field.replace(/([A-Z])/g, ' $1').trim()} to be determined]`;
        }
      });

      await new Promise(resolve => setTimeout(resolve, 800));
      onSubmit(filledData as ContractData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldGroups = {
    essential: template.fields.filter(f => 
      f.includes('name') || f.includes('date') || f.includes('address') || 
      f.includes('title') || f.includes('scope') || f.includes('rate')
    ),
    details: template.fields.filter(f => 
      f.includes('policy') || f.includes('requirements') || f.includes('terms') ||
      f.includes('schedule') || f.includes('process')
    ),
    legal: template.fields.filter(f => 
      f.includes('law') || f.includes('rights') || f.includes('liability') ||
      f.includes('confidential') || f.includes('dispute')
    ),
    other: template.fields.filter(f => 
      !fieldGroups.essential.includes(f) && 
      !fieldGroups.details.includes(f) && 
      !fieldGroups.legal.includes(f)
    )
  };

  const renderField = (field: string) => {
    const fieldLabel = field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
    
    const isIncomplete = incompleteFields.includes(field);

    if (isCheckboxField(field)) {
      return (
        <div key={field} className="flex items-center space-x-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
          <Checkbox 
            id={field}
            checked={formData[field] || false}
            onCheckedChange={(checked) => handleCheckboxChange(field, checked as boolean)}
          />
          <Label htmlFor={field}>{fieldLabel}</Label>
        </div>
      );
    }

    if (isDateField(field)) {
      return (
        <div key={field} className="space-y-2">
          <Label htmlFor={field} className="flex items-center gap-2">
            {fieldLabel}
            {isIncomplete && (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !formData[field] && "text-muted-foreground"
                } ${isIncomplete ? "border-yellow-500" : ""}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData[field] ? format(new Date(formData[field]), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData[field] ? new Date(formData[field]) : undefined}
                onSelect={(date) => handleDateChange(field, date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    }

    const isMultiline = field.includes('description') || 
                       field.includes('scope') || 
                       field.includes('terms') || 
                       field.includes('policy');

    const suggestions = getSuggestions(field);
    
    return (
      <div key={field} className="space-y-2">
        <Label htmlFor={field} className="flex items-center gap-2">
          {fieldLabel}
          {isIncomplete && (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
        </Label>
        {isMultiline ? (
          <Textarea
            id={field}
            placeholder={`Enter ${fieldLabel.toLowerCase()}`}
            value={formData[field] || ""}
            onChange={handleChange}
            rows={4}
            className={isIncomplete ? "border-yellow-500" : ""}
          />
        ) : (
          <div className="space-y-2">
            <Input
              id={field}
              placeholder={`Enter ${fieldLabel.toLowerCase()}`}
              value={formData[field] || ""}
              onChange={handleChange}
              className={isIncomplete ? "border-yellow-500" : ""}
            />
            {suggestions.length > 0 && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Suggestions:</Label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSuggestionClick(field, suggestion)}
                    >
                      <ListCheck className="mr-1 h-3 w-3" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>{isEditing ? "Edit Document" : "Create New Document"}</CardTitle>
          </div>
          <CardDescription>
            Fill in the details to {isEditing ? "update your" : "create a"} {template.name.toLowerCase()}. 
            Fields marked with yellow can be completed later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="document-form" onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {incompleteFields.length > 0 && (
              <Alert className="bg-yellow-50 border-yellow-500">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertTitle className="text-yellow-700">Some fields are incomplete</AlertTitle>
                <AlertDescription className="text-yellow-600">
                  You can still create the document. Incomplete fields will be marked with placeholders.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-lg font-semibold">Document Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter a name for this document" 
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="text-lg"
                />
              </div>
              
              <Tabs defaultValue="essential" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="essential">Essential Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="legal">Legal</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                
                <TabsContent value="essential" className="space-y-4 pt-4">
                  {fieldGroups.essential.map(field => renderField(field))}
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4 pt-4">
                  {fieldGroups.details.map(field => renderField(field))}
                </TabsContent>
                
                <TabsContent value="legal" className="space-y-4 pt-4">
                  {fieldGroups.legal.map(field => renderField(field))}
                </TabsContent>
                
                <TabsContent value="other" className="space-y-4 pt-4">
                  {fieldGroups.other.map(field => renderField(field))}
                </TabsContent>
              </Tabs>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
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
            className="min-w-[150px]"
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
