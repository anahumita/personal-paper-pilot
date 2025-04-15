
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Template } from "@/types";
import { TemplateCard } from "@/components/documents/TemplateCard";
import { TEMPLATES } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function TemplateSelection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredTemplates = TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelectTemplate = (template: Template) => {
    navigate(`/create/${template.id}`);
  };
  
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Choose a Template</h1>
          <p className="text-muted-foreground">
            Select a template to start creating your document
          </p>
        </div>
        
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard 
              key={template.id} 
              template={template}
              onSelect={handleSelectTemplate}
            />
          ))}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
