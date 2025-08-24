import React, {createContext, useState, useEffect, useContext} from "react";
import {type AuthenticatedResponse } from "@/api";

interface AuthContextType {
    user: AuthenticatedResponse | null;
    token: string | null;
    login: (authResponse : AuthenticatedResponse) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    return useContext(AuthContext);
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

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
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

