
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Plus, User, LogOut } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  user: { name: string } | null;
  onLogout: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const navigate = useNavigate();
  
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <FileText className="h-6 w-6" />
          <span className="text-xl font-bold">Personal Paper Pilot</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex gap-2"
                onClick={() => navigate("/documents")}
              >
                <FileText className="h-4 w-4" />
                My Documents
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex gap-2"
                onClick={() => navigate("/create")}
              >
                <Plus className="h-4 w-4" />
                New Document
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                    <span className="sr-only">Profile</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">{user.name}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/documents")}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>My Documents</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>New Document</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
