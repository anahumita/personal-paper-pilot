
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Template } from "@/types";
import { FileText } from "lucide-react";

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-center w-full h-32 bg-muted/40 rounded-md mb-4 items-center">
          <FileText className="h-16 w-16 text-primary/40" />
        </div>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground">
          <p>Form fields include:</p>
          <ul className="list-disc list-inside mt-2">
            {template.fields.slice(0, 4).map((field) => (
              <li key={field} className="capitalize">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </li>
            ))}
            {template.fields.length > 4 && (
              <li>+ {template.fields.length - 4} more</li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onSelect(template)}
        >
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}
