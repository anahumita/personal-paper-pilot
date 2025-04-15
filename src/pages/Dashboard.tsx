
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Document } from "@/types";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search, SortAsc, SortDesc, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_DOCUMENTS } from "@/lib/data";

interface DashboardProps {
  userId: string;
  onDownloadDocument: (document: Document) => Promise<void>;
}

export default function Dashboard({ userId, onDownloadDocument }: DashboardProps) {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  useEffect(() => {
    const fetchDocuments = async () => {
      // In a real app, this would be an API call
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      setDocuments(MOCK_DOCUMENTS.filter(doc => doc.userId === userId));
      setIsLoading(false);
    };
    
    fetchDocuments();
  }, [userId]);
  
  // Filter documents based on search term and active tab
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(doc.data).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
    const matchesTab = activeTab === "all" || 
      (activeTab === "signed" && doc.signed) || 
      (activeTab === "unsigned" && !doc.signed);
      
    return matchesSearch && matchesTab;
  });
  
  // Sort documents by creation date
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
  });
  
  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Documents</h1>
          <p className="text-muted-foreground">
            Manage all your contracts and documents
          </p>
        </div>
        <Button onClick={() => navigate("/create")}>
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </div>
      
      <div className="mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="signed">Signed</TabsTrigger>
              <TabsTrigger value="unsigned">Unsigned</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              >
                {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="m-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="h-48 bg-muted rounded-lg"></div>
                ))}
              </div>
            ) : sortedDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onDownload={onDownloadDocument}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/10">
                <div className="flex justify-center mb-4">
                  <div className="bg-muted p-4 rounded-full">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? "Try a different search term or clear your filters" 
                    : "Create your first document to get started"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => navigate("/create")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Document
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="signed" className="m-0">
            {!isLoading && sortedDocuments.length === 0 && (
              <div className="text-center py-12 border rounded-lg bg-muted/10">
                <div className="flex justify-center mb-4">
                  <div className="bg-muted p-4 rounded-full">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">No signed documents</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? "Try a different search term or clear your filters" 
                    : "Sign documents to see them here"}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unsigned" className="m-0">
            {!isLoading && sortedDocuments.length === 0 && (
              <div className="text-center py-12 border rounded-lg bg-muted/10">
                <div className="flex justify-center mb-4">
                  <div className="bg-muted p-4 rounded-full">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">No unsigned documents</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? "Try a different search term or clear your filters" 
                    : "Create a document to get started"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => navigate("/create")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Document
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
