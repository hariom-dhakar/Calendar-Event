"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import ConnectCalendar from "../components/ConnectCalendar"
import CreateEvent from "../components/CreateEvent"
import CalendarView from "../components/CalendarView"
import CalendarStats from "../components/CalendarStats"

const Dashboard: React.FC = () => {
  const { user, logout, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<"overview" | "connect" | "calendar" | "create">("overview")
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined)

  // Function to handle date selection from calendar
  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setActiveTab("create")
  }

  // Clear selected date when switching away from create tab
  const handleTabChange = (tab: "overview" | "connect" | "calendar" | "create") => {
    if (tab !== "create") {
      setSelectedDate(undefined)
    }
    setActiveTab(tab)
  }

  // Redirect from connect tab if user becomes connected
  useEffect(() => {
    if (user?.isCalendarConnected && activeTab === "connect") {
      handleTabChange("overview")
    }
  }, [user?.isCalendarConnected, activeTab])

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Calendar Integration
              </h1>
              {user?.isCalendarConnected && (
                <span className="mt-2 sm:mt-0 sm:ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  Connected
                </span>
              )}
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4 w-full sm:w-auto">
              <div className="flex items-center space-x-2 min-w-0">
                <img 
                  className="h-8 w-8 rounded-full border-2 border-gray-200 flex-shrink-0" 
                  src={user?.picture || "/placeholder.svg"} 
                  alt={user?.name || "User"} 
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-gray-700 truncate">{user?.name}</span>
                  <span className="text-xs text-gray-500 truncate hidden sm:block">{user?.email}</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center flex-shrink-0"
              >
                <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="sm:px-0">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-4 sm:mb-6">
            <nav className="-mb-px flex flex-wrap sm:flex-nowrap space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => handleTabChange("overview")}
                className={`${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out flex items-center flex-shrink-0`}
              >
                <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Home</span>
              </button>
              
              {/* Only show Connect Calendar tab if not connected */}
              {!user?.isCalendarConnected && (
                <button
                  onClick={() => handleTabChange("connect")}
                  className={`${
                    activeTab === "connect"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out flex items-center flex-shrink-0`}
                >
                  <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="hidden sm:inline">Connect Calendar</span>
                  <span className="sm:hidden">Connect</span>
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    !
                  </span>
                </button>
              )}

              <button
                onClick={() => handleTabChange("calendar")}
                className={`${
                  activeTab === "calendar"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out flex items-center flex-shrink-0`}
              >
                <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">Calendar View</span>
                <span className="sm:hidden">Calendar</span>
              </button>

              <button
                onClick={() => handleTabChange("create")}
                className={`${
                  activeTab === "create"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out flex items-center flex-shrink-0`}
              >
                <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="hidden sm:inline">Create Event</span>
                <span className="sm:hidden">Create</span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-4 sm:mt-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                    <h2 className="text-lg font-medium text-gray-900">Dashboard Overview</h2>
                    {user?.isCalendarConnected ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                        Calendar Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 w-fit">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                        Calendar Not Connected
                      </span>
                    )}
                  </div>
                  
                  {user?.isCalendarConnected ? (
                    <div className="space-y-4 sm:space-y-6">
                      <CalendarStats />
                      
                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Quick Actions</h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleTabChange("calendar")}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            View Calendar
                          </button>
                          <button
                            onClick={() => handleTabChange("create")}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Event
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Connect your Google Calendar</h3>
                      <p className="mt-1 text-sm text-gray-500 px-4">Get started by connecting your Google Calendar to view and manage events.</p>
                      <div className="mt-4 sm:mt-6">
                        <button
                          onClick={() => handleTabChange("connect")}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          Connect Calendar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Connect Calendar Tab */}
            {activeTab === "connect" && (
              <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                <ConnectCalendar />
              </div>
            )}

            {/* Calendar View Tab */}
            {activeTab === "calendar" && (
              <div className="space-y-4 sm:space-y-6">
                {user?.isCalendarConnected ? (
                  <CalendarView onDateSelect={handleDateSelect} />
                ) : (
                  <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                    <div className="text-center py-6 sm:py-8">
                      <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Calendar not connected</h3>
                      <p className="mt-1 text-sm text-gray-500 px-4">Please connect your Google Calendar first to view events.</p>
                      <div className="mt-4 sm:mt-6">
                        <button
                          onClick={() => handleTabChange("connect")}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                        >
                          Connect Calendar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Create Event Tab */}
            {activeTab === "create" && (
              <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                {selectedDate && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-blue-700">
                        Creating event for: <strong>{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                      </span>
                      <button
                        onClick={() => setSelectedDate(undefined)}
                        className="ml-auto text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                {user?.isCalendarConnected ? (
                  <CreateEvent selectedDate={selectedDate} />
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Calendar not connected</h3>
                    <p className="mt-1 text-sm text-gray-500 px-4">Please connect your Google Calendar first to create events.</p>
                    <div className="mt-4 sm:mt-6">
                      <button
                        onClick={() => handleTabChange("connect")}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                      >
                        Connect Calendar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
