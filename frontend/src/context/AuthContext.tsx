"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
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

  // Check auth status on mount and handle OAuth callback
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        // Check for OAuth callback parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const authResult = urlParams.get('auth');
        const authMessage = urlParams.get('message');
        
        if (authResult === 'success') {
          // Clear URL parameters and refresh auth status
          window.history.replaceState({}, document.title, window.location.pathname);
          console.log('OAuth success detected, checking auth status...');
        } else if (authResult === 'error') {
          // Handle auth error
          console.error('OAuth error:', authMessage);
          setLoading(false);
          setUser(null);
          if (authMessage) {
            alert(`Authentication failed: ${decodeURIComponent(authMessage)}`);
          }
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          return; // Exit early, don't check auth status
        }

        // Check current auth status
        const response = await api.get("/auth/status");
        if (response.data.isAuthenticated && response.data.user) {
          setUser(response.data.user);
          console.log('User authenticated:', response.data.user.email);
        } else {
          setUser(null);
          console.log('User not authenticated');
        }
      } catch (error: any) {
        console.log("Auth check: User not logged in");
        // Check if it's a network error vs auth error
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
          console.error("Cannot connect to backend server. Make sure it's running on http://localhost:5000");
          alert("Cannot connect to server. Please check if the backend is running.");
        } else if (error.response?.status === 401) {
          // This is expected for unauthenticated users
          console.log("User not authenticated (401)");
        } else {
          console.error("Unexpected auth error:", error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkInitialAuth();
  }, []); // Empty dependency array - only run on mount

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/status");
      if (response.data.isAuthenticated && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      // Don't log 401 errors as they're expected for unauthenticated users
      if (error.response?.status !== 401) {
        console.error("Auth status check failed:", error);
      }

      // Handle specific auth errors
      if (error.response?.status === 401) {
        console.log("User not authenticated, clearing user state");
        setUser(null);
      } else if (error.response?.data?.needsReauth) {
        console.log("User needs re-authentication");
        setUser(null);
        // Could show a toast here about needing to re-authenticate
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
      console.log("Redirecting to:", response.data.authUrl);
      window.location.href = response.data.authUrl;
    } catch (error: any) {
      console.error("Login error:", error);
      setLoading(false);
      // You could show a toast error here if needed
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
