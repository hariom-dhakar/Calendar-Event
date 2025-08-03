"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import CreateEvent from "../components/CreateEvent"
import CalendarView from "../components/CalendarView"

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"connect" | "create" | "calendar">("connect")

  // Set default tab based on connection status
  useEffect(() => {
    if (user?.isCalendarConnected && activeTab === "connect") {
      setActiveTab("calendar")
    }
  }, [user?.isCalendarConnected, activeTab])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4 sm:gap-0">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Calendar Hub
                  </h1>
                  <p className="text-sm text-gray-500 hidden sm:block">Manage your Google Calendar events</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 rounded-full px-3 sm:px-4 py-2">
                <img 
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-2 ring-white shadow-md" 
                  src={user?.picture || "/placeholder.svg"} 
                  alt={user?.name} 
                />
                <div className="hidden sm:block">
                  <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <span className="hidden sm:inline">Logout</span>
                <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Connection Status Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${user?.isCalendarConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Calendar Status</h3>
                  <p className="text-sm text-gray-600">
                    {user?.isCalendarConnected ? 'Connected to Google Calendar' : 'Connecting to Google Calendar...'}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                user?.isCalendarConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user?.isCalendarConnected ? '✓ Connected' : '⏳ Connecting'}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="border-b border-gray-200/50">
              <nav className="flex space-x-0" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`${
                    activeTab === "calendar"
                      ? "bg-blue-50 border-b-2 border-blue-500 text-blue-700"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  } flex-1 py-4 px-4 sm:px-6 text-center font-medium text-sm sm:text-base transition-all duration-200 flex items-center justify-center space-x-2`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Calendar View</span>
                  <span className="sm:hidden">Calendar</span>
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className={`${
                    activeTab === "create"
                      ? "bg-blue-50 border-b-2 border-blue-500 text-blue-700"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  } flex-1 py-4 px-4 sm:px-6 text-center font-medium text-sm sm:text-base transition-all duration-200 flex items-center justify-center space-x-2`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">Create Event</span>
                  <span className="sm:hidden">Create</span>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === "create" && <CreateEvent />}
              {activeTab === "calendar" && <CalendarView />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
