
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, FileCheck, FilePen, ArrowRight, Check } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="flex-1">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 text-center">
          <div className="space-y-3 mb-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Personal Paper Pilot
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Generate personalized contracts in minutes. Select templates, fill in details, and download professional documents instantly.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" onClick={() => navigate("/register")}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Log In
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Choose Templates</h3>
              <p className="text-muted-foreground">
                Select from professional templates for any business situation.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <FilePen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customize Details</h3>
              <p className="text-muted-foreground">
                Fill in your specific information with our easy-to-use forms.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <FileCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Download & Sign</h3>
              <p className="text-muted-foreground">
                Get your professional PDF contract ready to sign and use.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-muted py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Features That Make a Difference</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Our platform is designed to simplify your contract creation process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Check className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Professional Templates</h3>
              </div>
              <p className="text-muted-foreground">
                Access a library of legally-sound document templates for various needs.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Check className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Digital Signatures</h3>
              </div>
              <p className="text-muted-foreground">
                Sign your documents digitally with our built-in signature tool.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Check className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">PDF Generation</h3>
              </div>
              <p className="text-muted-foreground">
                Convert your completed forms into professional PDF documents instantly.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Check className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Document Management</h3>
              </div>
              <p className="text-muted-foreground">
                Keep track of all your contracts in one organized dashboard.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Check className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Easy Form Filling</h3>
              </div>
              <p className="text-muted-foreground">
                Intuitive forms make entering contract details quick and error-free.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Check className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Secure Storage</h3>
              </div>
              <p className="text-muted-foreground">
                Your documents are securely stored and accessible anytime.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Button size="lg" onClick={() => navigate("/register")}>
              Start Creating Documents
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-background border-t py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <FileText className="h-5 w-5" />
              <span className="font-semibold">Personal Paper Pilot</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Personal Paper Pilot. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
