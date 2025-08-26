import { type AuthenticatedResponse, type UserResponse } from "@/api";
import authApi from "@/services/authentication/apiAuthentication";
import userApi from "@/services/user/apiUser";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserResponse | null;
  token: string | null;
  login: (authResponse: AuthenticatedResponse) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  // if (context === undefined) {
  //     throw new Error("useAuth must be used within an AuthProvider");
  // }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (authResponse: AuthenticatedResponse) => {
    if (!authResponse.token) return;

    try {
      // Save token first
      setToken(authResponse.token);
      localStorage.setItem("token", authResponse.token);

      // Fetch user data
      const response = await userApi.getCurrentUser();
      const user = response.data ?? null;

      setUser(user);
      setIsAuthenticated(!!user);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);

      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const logout = async () => {
    try {
      const res = await authApi.logout();

      if(res.success) {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    // logic để lấy thông tin user từ token đã lưu
    setIsLoading(false);
  }, [token]);

  const value = { user, token, login, logout, isLoading, isAuthenticated };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
