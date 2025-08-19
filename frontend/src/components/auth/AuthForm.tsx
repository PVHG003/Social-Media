import type { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/authContext";
import type { LoginRequest } from "@/api";
import { useNavigate } from "react-router-dom";

// Props
interface AuthFormProps {
  state: "login" | "register";
}

// Schema
const authFormSchema = z.object({
  email: z.email().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// Infer form type from schema
type AuthFormData = z.infer<typeof authFormSchema>;

const AuthForm: FunctionComponent<AuthFormProps> = ({ state }) => {
  const { login, user } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authFormSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    if (state === "login") {
      const loginRequest: LoginRequest = {
        email: data.email,
        password: data.password,
      };
      await login(loginRequest).then(() => navigate("/chat"));
    } else {
      console.log("Registering with", data);
    }
  };

  if (user) {
    console.log("user context in login", user)
    navigate("/chat");
    return;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          {...register("email")}
          className="border px-2 py-1 rounded w-full"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="border px-2 py-1 rounded w-full"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {state === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
};

export default AuthForm;
