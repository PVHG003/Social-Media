import AuthForm from "@/components/auth/AuthForm";
import type { FunctionComponent } from "react";

interface LoginPageProps {}

const LoginPage: FunctionComponent<LoginPageProps> = () => {
  return <AuthForm state="login" />;
};

export default LoginPage;
