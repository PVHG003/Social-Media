import React, {createContext, useState, useEffect, useContext} from "react";
import {type AuthenticatedResponse } from "@/api";
import authApi from "@/services/authentication/apiAuthentication";

interface AuthContextType {
    user: AuthenticatedResponse | null;
    token: string | null;
    login: (authResponse : AuthenticatedResponse) => void;
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
    const [user, setUser] = useState<AuthenticatedResponse | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const login = (authResponse: AuthenticatedResponse) => {
        if(authResponse.token) {
            setUser(authResponse);
            setToken(authResponse.token);
            localStorage.setItem("token", authResponse.token);
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            window.location.href = "/login"; // Redirect to login page after logout
        }
    }

    useEffect(() => {
        // logic để lấy thông tin user từ token đã lưu
        setIsLoading(false);
    }, [token])

    const value = {user, token, login, logout, isLoading};

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

