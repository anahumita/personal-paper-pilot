
import { LoginForm } from "@/components/auth/LoginForm";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <LoginForm onLogin={onLogin} />
    </div>
  );
}
