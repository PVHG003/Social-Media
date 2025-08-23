import type { LoginRequest, UserResponse } from "@/api";
import { apiAuth, apiUser } from "@/services/chat/test/apiAuth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface AuthContextInterface {
  currentUser: UserResponse | null;
  token: string | null;
  login: (loginRequest: LoginRequest) => Promise<void>;
  logout: () => void;
  authenticated: boolean;
}

export const AuthContext = createContext<AuthContextInterface | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [currentUser, setCurrentUser] = useState<UserResponse | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const authenticated = !!currentUser;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken) setToken(storedToken);
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  const login = async (loginRequest: LoginRequest) => {
    const { data } = await apiAuth.login(loginRequest);
    if (data) {
      const tokenValue = data.token ?? "";
      setToken(tokenValue);
      localStorage.setItem("token", tokenValue);

      const { data: user } = await apiUser.getCurrentUser(tokenValue);

      setCurrentUser(user ?? null);
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value: AuthContextInterface = {
    currentUser,
    token,
    login,
    logout,
    authenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
