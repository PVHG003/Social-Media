import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { UserDto, LoginRequest } from "@/api";
import authApi from "@/services/authApi";

interface AuthContextInterface {
  currentUser: UserDto | null;
  token: string | null;
  login: (loginRequest: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [currentUser, setCurrentUser] = useState<UserDto | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken) setToken(storedToken);
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  const login = async (loginRequest: LoginRequest) => {
    const { data } = await authApi.login(loginRequest);
    if (data) {
      const tokenValue = data.token ?? "";
      setCurrentUser(data.user ?? null);
      setToken(tokenValue);
      localStorage.setItem("token", tokenValue);
      localStorage.setItem("user", JSON.stringify(data.user));
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
