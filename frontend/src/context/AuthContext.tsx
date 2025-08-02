"use client";

import type React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../api/api";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  isCalendarConnected: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await api.get("/auth/status");
      if (response.data.isAuthenticated && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.error("Auth status check failed:", error);

      if (error.response?.status === 401) {
        console.log("User not authenticated, clearing user state");
        setUser(null);
      } else if (error.response?.data?.needsReauth) {
        console.log("User needs re-authentication");
        setUser(null);
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/google");
      window.location.href = response.data.authUrl;
    } catch (error: any) {
      console.error("Login error:", error);
      setLoading(false);
      if (error.response?.status === 403) {
        alert(
          "OAuth access denied. Please contact the developer to be added as a test user."
        );
      }
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
