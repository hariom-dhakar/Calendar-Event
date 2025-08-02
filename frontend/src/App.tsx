"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";

function App() {
  const { user, loading, checkAuthStatus } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const authStatus = useMemo(() => searchParams.get("auth"), [searchParams]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (authStatus === "success") {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete("auth");
        return newParams;
      });
      checkAuthStatus();
    } else if (authStatus === "error") {
      const message = searchParams.get("message");
      const errorMessage = message
        ? decodeURIComponent(message)
        : "Authentication failed";

      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete("auth");
        newParams.delete("message");
        return newParams;
      });

      import("react-hot-toast").then(({ default: toast }) => {
        toast.error(errorMessage);
      });
    }
  }, [authStatus, setSearchParams, checkAuthStatus, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {user ? <Dashboard /> : <Login />}
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
