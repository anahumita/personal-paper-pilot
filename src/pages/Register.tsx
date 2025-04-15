
import { RegisterForm } from "@/components/auth/RegisterForm";

interface RegisterProps {
  onRegister: (name: string, email: string, password: string) => void;
}

export default function Register({ onRegister }: RegisterProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <RegisterForm onRegister={onRegister} />
    </div>
  );
}
