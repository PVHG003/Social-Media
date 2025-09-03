import {type AuthenticatedResponse, type UserResponse} from "@/api";
import authApi from "@/services/authentication/apiAuthentication";
import userApi from "@/services/user/apiUser";
import React, {createContext, useContext, useEffect, useState} from "react";

interface AuthContextType {
	isAuthenticated: boolean;
	user: UserResponse | null;
	authUser: AuthenticatedResponse | null;
	token: string | null;
	login: (authResponse: AuthenticatedResponse) => void;
	logout: () => Promise<void>;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState<UserResponse | null>(null);
	const [authUser, setAuthUser] = useState<AuthenticatedResponse | null>(null);
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token")
	);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const login = (authResponse: AuthenticatedResponse) => {
		if (!authResponse.token) return;

		setToken(authResponse.token);
		setAuthUser(authResponse);
		localStorage.setItem("token", authResponse.token);
		localStorage.setItem("authUser", JSON.stringify(authResponse));
	};

	const logout = async () => {
		try {
			const res = await authApi.logout();

			if (res.success) {
				setIsAuthenticated(false);
				setUser(null);
				setAuthUser(null);
				setToken(null);
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				localStorage.removeItem("authUser");
				window.location.href = "/login";
			}
		} catch (error) {
			setIsAuthenticated(false);
			setUser(null);
			setAuthUser(null);
			setToken(null);
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			localStorage.removeItem("authUser");
			window.location.href = "/login";
			console.error("Logout failed:", error);
		}
	};

	useEffect(() => {
		const fetchUser = async () => {
			if (!token) {
				setIsAuthenticated(false);
				setUser(null);
				setAuthUser(null);
				setIsLoading(false);
				return;
			}

			try {
				// Load authUser from localStorage
				const storedAuthUser = localStorage.getItem("authUser");
				if (storedAuthUser) {
					setAuthUser(JSON.parse(storedAuthUser));
				}

				const response = await userApi.getCurrentUser();
				const user = response.data ?? null;

				console.log("Fetched user data:", user);

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
				setAuthUser(null);
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				localStorage.removeItem("authUser");
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, [token]);

	const value = {user, authUser, token, login, logout, isLoading, isAuthenticated};

	return (
		<AuthContext.Provider value={value}>
			{!isLoading && children}
		</AuthContext.Provider>
	);
};
