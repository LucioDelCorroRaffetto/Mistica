import React, {
  useState,
  type ReactNode,
  useEffect,
  useCallback,
} from "react";
import {
  getMe as getMeService,
  login as loginService,
  register as registerService,
} from "../services/auth";
import type { LoginRequest, RegisterRequest } from "../types/auth";
import type { User } from "@domain/entities/User";
import { AuthContext } from "./auth-context-context";

export type UserWithoutPassword = Omit<User, "password">;

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: UserWithoutPassword | null;
  refreshUser: () => Promise<void>;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (request: RegisterRequest) => Promise<void>;
  isLoading: boolean;
}

// AuthContext is now exported from auth-context-context.ts

const AUTH_STORAGE_KEY = "auth-token";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(AUTH_STORAGE_KEY)
  );
  const [user, setUser] = useState<UserWithoutPassword | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token;

  const getMe = useCallback(async () => {
    try {
      const userData = await getMeService();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (request: LoginRequest) => {
    const response = await loginService(request);
    const newToken = response.payload.accessToken;
    setToken(newToken);
    localStorage.setItem(AUTH_STORAGE_KEY, newToken);
    await getMe();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const register = async (request: RegisterRequest) => {
    const response = await registerService(request);
    const newToken = response.payload.accessToken;
    setToken(newToken);
    localStorage.setItem(AUTH_STORAGE_KEY, newToken);
    await getMe();
  };

  useEffect(() => {
    if (token) {
      getMe();
    } else {
      setIsLoading(false);
    }
  }, [token, getMe]);

  const value = {
    isAuthenticated,
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    refreshUser: getMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};