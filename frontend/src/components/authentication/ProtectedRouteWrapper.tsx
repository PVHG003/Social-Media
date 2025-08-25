import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/authentication/AuthContext";

const ProtectedRouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, isLoading } = useAuth()!;

    if (isLoading) {
        return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
    }

    if(!token) {
        return <Navigate to="/login" replace />;
    }

    return<>(children)</>
};

export default ProtectedRouteWrapper;