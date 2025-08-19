import AuthForm from "@/components/auth/AuthForm";
import type { FunctionComponent } from "react";

interface RegisterPageProps {}

const RegisterPage: FunctionComponent<RegisterPageProps> = () => {
  return <AuthForm state="register" />;
};

export default RegisterPage;
