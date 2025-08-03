"use client"

import { useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import { Toaster } from "react-hot-toast"

function App() {
  const { user, loading, checkAuthStatus } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  // Memoize the auth status to prevent unnecessary re-renders
  const authStatus = useMemo(() => searchParams.get("auth"), [searchParams])

  // Initial auth check - only run once on mount
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  // Handle OAuth callback - both success and error cases
  useEffect(() => {
    if (authStatus === "success") {
      // Clear the auth parameter immediately
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev)
        newParams.delete("auth")
        return newParams
      })
      // Check auth status after successful OAuth
      checkAuthStatus()
    } else if (authStatus === "error") {
      // Handle OAuth errors
      const message = searchParams.get("message")
      const errorMessage = message ? decodeURIComponent(message) : "Authentication failed"
      
      // Clear the error parameters
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev)
        newParams.delete("auth")
        newParams.delete("message")
        return newParams
      })
      
      // Show error message
      import("react-hot-toast").then(({ default: toast }) => {
        toast.error(errorMessage)
      })
    }
  }, [authStatus, setSearchParams, checkAuthStatus, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">{user ? <Dashboard /> : <Login />}</div>
      <Toaster position="top-right" />
    </>
  )
}

export default App
