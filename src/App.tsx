
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { User, Document } from "@/types";
import { MOCK_DOCUMENTS } from "@/lib/data";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TemplateSelection from "./pages/TemplateSelection";
import CreateDocument from "./pages/CreateDocument";
import EditDocument from "./pages/EditDocument";
import SignDocument from "./pages/SignDocument";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);

  // Check if user is logged in on app load (for demo only)
  useEffect(() => {
    const savedUser = localStorage.getItem("ppp_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("ppp_user");
      }
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // In a real app, this would validate credentials against a database
    const mockUser: User = {
      id: "user-1",
      email,
      name: email.split('@')[0],
    };

    setUser(mockUser);
    localStorage.setItem("ppp_user", JSON.stringify(mockUser));
    toast({
      title: "Login successful",
      description: `Welcome back, ${mockUser.name}!`,
    });
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // In a real app, this would create a user in the database
    const mockUser: User = {
      id: "user-1",
      email,
      name,
    };

    setUser(mockUser);
    localStorage.setItem("ppp_user", JSON.stringify(mockUser));
    toast({
      title: "Registration successful",
      description: `Welcome, ${name}!`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("ppp_user");
    navigate("/");
    toast({
      title: "Logout successful",
      description: "You have been logged out.",
    });
  };

  const handleDocumentCreated = (document: Document) => {
    setDocuments(prev => [...prev, document]);
    toast({
      title: "Document created",
      description: "Your document has been created successfully.",
    });
  };

  const handleDocumentUpdated = (updatedDocument: Document) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === updatedDocument.id ? updatedDocument : doc
    ));
    toast({
      title: "Document updated",
      description: "Your document has been updated successfully.",
    });
  };

  const handleDocumentSigned = (updatedDocument: Document, signatureUrl: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === updatedDocument.id ? updatedDocument : doc
    ));
    toast({
      title: "Document signed",
      description: "Your document has been signed successfully.",
    });
  };

  const handleDownloadDocument = async (document: Document) => {
    // In a real app, this would generate and download a PDF
    // For demo purposes, we'll just show a toast
    toast({
      title: "Download started",
      description: `Downloading "${document.name}" as PDF...`,
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Download complete",
      description: `"${document.name}" has been downloaded.`,
    });
  };

  // Routes that require authentication
  const protectedRoutes = (
    <>
      <Route 
        path="/documents" 
        element={
          <Dashboard 
            userId={user?.id || ""} 
            onDownloadDocument={handleDownloadDocument}
          />
        } 
      />
      <Route 
        path="/create" 
        element={<TemplateSelection />} 
      />
      <Route 
        path="/create/:templateId" 
        element={
          <CreateDocument 
            userId={user?.id || ""} 
            onDocumentCreated={handleDocumentCreated}
          />
        } 
      />
      <Route 
        path="/documents/:documentId/edit" 
        element={
          <EditDocument 
            userId={user?.id || ""} 
            onDocumentUpdated={handleDocumentUpdated}
            documents={documents}
          />
        } 
      />
      <Route 
        path="/documents/:documentId/sign" 
        element={
          <SignDocument 
            userId={user?.id || ""} 
            onDocumentSigned={handleDocumentSigned}
            onDownloadDocument={handleDownloadDocument}
            documents={documents}
          />
        } 
      />
    </>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="flex flex-col min-h-screen">
          <Navbar user={user} onLogout={handleLogout} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onRegister={handleRegister} />} />
              
              {/* Protected routes - only accessible when logged in */}
              {user ? protectedRoutes : null}
              
              {/* If the user is not logged in and tries to access a protected route, redirect to login */}
              {!user && (
                <>
                  <Route path="/documents" element={<Login onLogin={handleLogin} />} />
                  <Route path="/create" element={<Login onLogin={handleLogin} />} />
                  <Route path="/create/:templateId" element={<Login onLogin={handleLogin} />} />
                  <Route path="/documents/:documentId/edit" element={<Login onLogin={handleLogin} />} />
                  <Route path="/documents/:documentId/sign" element={<Login onLogin={handleLogin} />} />
                </>
              )}
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
