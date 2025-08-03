"use client"

import React, { useState, useEffect } from "react"
import { api } from "../api/api"
import { useAuth } from "../context/AuthContext"
import CalendarStats from "./CalendarStats"
import toast from "react-hot-toast"

interface CalendarEvent {
  id: string
  summary: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  description?: string
  htmlLink: string
  colorId?: string
}

type ViewType = "month" | "week" | "day"

const CalendarView: React.FC = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>("month")
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    eventId: string
    eventName: string
  }>({ isOpen: false, eventId: "", eventName: "" })

  // Delete event function
  const deleteEvent = async (eventId: string, eventName: string) => {
    setDeleteConfirmation({ isOpen: true, eventId, eventName })
  }

  const confirmDelete = async () => {
    const { eventId } = deleteConfirmation
    
    try {
      setDeletingEventId(eventId)
      setDeleteConfirmation({ isOpen: false, eventId: "", eventName: "" })
      
      await api.delete(`/calendar/events/${eventId}`)
      
      // Remove the event from local state
      setEvents(prev => prev.filter(event => event.id !== eventId))
      toast.success("Event deleted successfully")
    } catch (error: any) {
      console.error("Error deleting event:", error)
      const errorMessage = error.response?.data?.error || "Failed to delete event"
      toast.error(errorMessage)
    } finally {
      setDeletingEventId(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, eventId: "", eventName: "" })
  }

  // Fetch events from Google Calendar
  const fetchEvents = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true)
      const response = await api.get("/calendar/events", {
        params: {
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          maxResults: 50,
          orderBy: "startTime",
          singleEvents: true,
        },
      })
      
      console.log('CalendarView: Fetched events:', response.data.events?.length || 0)
      setEvents(response.data.events || [])
    } catch (error: any) {
      console.error("Error fetching events:", error)
      toast.error("Failed to fetch calendar events")
      setEvents([]) // Reset events on error
    } finally {
      setLoading(false)
    }
  }

  // Get date range based on current view
  const getDateRange = () => {
    const start = new Date(currentDate)
    const end = new Date(currentDate)

    switch (view) {
      case "month":
        start.setDate(1)
        start.setHours(0, 0, 0, 0)
        end.setMonth(end.getMonth() + 1, 0)
        end.setHours(23, 59, 59, 999)
        break
      case "week":
        const dayOfWeek = start.getDay()
        start.setDate(start.getDate() - dayOfWeek)
        start.setHours(0, 0, 0, 0)
        end.setDate(start.getDate() + 6)
        end.setHours(23, 59, 59, 999)
        break
      case "day":
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        break
    }

    return { start, end }
  }

  // Load events when view or date changes
  useEffect(() => {
    if (user?.isCalendarConnected) {
      const { start, end } = getDateRange()
      fetchEvents(start, end)
    }
  }, [currentDate, view, user?.isCalendarConnected])

  // Navigation functions
  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    switch (view) {
      case "month":
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case "week":
        newDate.setDate(newDate.getDate() - 7)
        break
      case "day":
        newDate.setDate(newDate.getDate() - 1)
        break
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    switch (view) {
      case "month":
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case "week":
        newDate.setDate(newDate.getDate() + 7)
        break
      case "day":
        newDate.setDate(newDate.getDate() + 1)
        break
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Format date for display
  const formatDate = (date: Date) => {
    switch (view) {
      case "month":
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
      case "week":
        const weekStart = new Date(date)
        const dayOfWeek = weekStart.getDay()
        weekStart.setDate(weekStart.getDate() - dayOfWeek)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)
        return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      case "day":
        return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    }
  }

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime || event.start.date || "")
      return eventDate.toDateString() === date.toDateString()
    })
  }

  // Render month view
  const renderMonthView = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const startDate = new Date(startOfMonth)
    startDate.setDate(startDate.getDate() - startOfMonth.getDay())

    const days = []
    const currentDateObj = new Date(startDate)

    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(currentDateObj)
      const dayEvents = getEventsForDate(date)
      const isCurrentMonth = date.getMonth() === currentDate.getMonth()
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div
          key={date.toISOString()}
          className={`min-h-[100px] sm:min-h-[120px] p-2 sm:p-3 border border-gray-200/60 transition-all duration-200 hover:shadow-md ${
            isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50/50"
          } ${isToday ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 ring-1 ring-blue-200" : ""}`}
        >
          <div className={`text-sm sm:text-base font-semibold mb-2 ${
            isCurrentMonth ? "text-gray-900" : "text-gray-400"
          } ${isToday ? "text-blue-700" : ""}`}>
            {date.getDate()}
            {isToday && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full ml-1 inline-block"></div>}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event, index) => (
              <div
                key={event.id}
                className={`text-xs sm:text-sm p-1.5 sm:p-2 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-sm group relative ${
                  index % 3 === 0 ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300' :
                  index % 3 === 1 ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300' :
                  'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300'
                } truncate`}
                title={event.summary}
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center space-x-1 flex-1 min-w-0"
                    onClick={() => window.open(event.htmlLink, "_blank")}
                  >
                    <div className="w-1.5 h-1.5 bg-current rounded-full flex-shrink-0"></div>
                    <span className="truncate">{event.summary}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteEvent(event.id, event.summary)
                    }}
                    disabled={deletingEventId === event.id}
                    className="opacity-0 group-hover:opacity-100 ml-1 p-1 rounded-full hover:bg-red-200 text-red-600 hover:text-red-800 transition-all duration-200 flex-shrink-0"
                    title="Delete event"
                  >
                    {deletingEventId === event.id ? (
                      <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 text-center">
                +{dayEvents.length - 3} more events
              </div>
            )}
          </div>
        </div>
      )

      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }

    return (
      <div className="bg-white rounded-lg shadow">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    )
  }

  // Render week view
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(date.getDate() + i)
      const dayEvents = getEventsForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div key={date.toISOString()} className="flex-1 min-h-[500px] border-r border-gray-200 last:border-r-0">
          <div className={`p-3 text-center border-b border-gray-200 ${isToday ? "bg-blue-50 text-blue-600 font-semibold" : "bg-gray-50"}`}>
            <div className="text-sm">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
            <div className={`text-lg ${isToday ? "bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto" : ""}`}>
              {date.getDate()}
            </div>
          </div>
          <div className="p-2 space-y-1">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="p-2 bg-blue-100 text-blue-800 rounded text-sm cursor-pointer hover:bg-blue-200 group relative"
                title={event.summary}
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-1 min-w-0"
                    onClick={() => window.open(event.htmlLink, "_blank")}
                  >
                    <div className="font-medium truncate">{event.summary}</div>
                    {event.start.dateTime && (
                      <div className="text-xs">
                        {new Date(event.start.dateTime).toLocaleTimeString("en-US", { 
                          hour: "numeric", 
                          minute: "2-digit",
                          hour12: true 
                        })}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteEvent(event.id, event.summary)
                    }}
                    disabled={deletingEventId === event.id}
                    className="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded-full hover:bg-red-200 text-red-600 hover:text-red-800 transition-all duration-200 flex-shrink-0"
                    title="Delete event"
                  >
                    {deletingEventId === event.id ? (
                      <div className="w-4 h-4 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex">
          {days}
        </div>
      </div>
    )
  }

  // Render day view
  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </h3>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {hours.map(hour => (
            <div key={hour} className="flex border-b border-gray-100">
              <div className="w-20 p-2 text-sm text-gray-500 text-right">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>
              <div className="flex-1 p-2 min-h-[60px]">
                {dayEvents
                  .filter(event => {
                    if (!event.start.dateTime) return false
                    const eventHour = new Date(event.start.dateTime).getHours()
                    return eventHour === hour
                  })
                  .map(event => (
                    <div
                      key={event.id}
                      className="p-2 bg-blue-100 text-blue-800 rounded text-sm cursor-pointer hover:bg-blue-200 mb-1 group relative"
                    >
                      <div className="flex items-start justify-between">
                        <div 
                          className="flex-1 min-w-0"
                          onClick={() => window.open(event.htmlLink, "_blank")}
                        >
                          <div className="font-medium">{event.summary}</div>
                          {event.start.dateTime && (
                            <div className="text-xs">
                              {new Date(event.start.dateTime).toLocaleTimeString("en-US", { 
                                hour: "numeric", 
                                minute: "2-digit",
                                hour12: true 
                              })}
                              {event.end.dateTime && (
                                ` - ${new Date(event.end.dateTime).toLocaleTimeString("en-US", { 
                                  hour: "numeric", 
                                  minute: "2-digit",
                                  hour12: true 
                                })}`
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteEvent(event.id, event.summary)
                          }}
                          disabled={deletingEventId === event.id}
                          className="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded-full hover:bg-red-200 text-red-600 hover:text-red-800 transition-all duration-200 flex-shrink-0"
                          title="Delete event"
                        >
                          {deletingEventId === event.id ? (
                            <div className="w-4 h-4 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!user?.isCalendarConnected) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200/50 p-8 sm:p-12 text-center">
        <div className="text-gray-400 mb-6">
          <svg className="mx-auto h-16 w-16 sm:h-20 sm:w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Calendar Not Connected</h3>
        <p className="text-gray-600 text-lg">Please connect your Google Calendar to view and manage events.</p>
        <div className="mt-6 flex justify-center">
          <div className="animate-pulse flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animation-delay-150"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animation-delay-300"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Calendar Stats */}
      <CalendarStats />
      
      {/* Calendar Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={goToToday}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Today
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={navigatePrevious}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={navigateNext}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {formatDate(currentDate)}
            </h2>
          </div>

          {/* View Toggle */}
          <div className="flex rounded-xl shadow-sm bg-gray-100 p-1">
            {(["month", "week", "day"] as ViewType[]).map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-4 sm:px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  view === viewType
                    ? "bg-white text-blue-700 shadow-md transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading your calendar events...</p>
          </div>
        </div>
      )}

      {/* Calendar Content */}
      {!loading && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          {view === "month" && renderMonthView()}
          {view === "week" && renderWeekView()}
          {view === "day" && renderDayView()}
        </div>
      )}

      {/* Events Summary */}
      {!loading && events.length === 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-200/50 p-8 sm:p-12 text-center">
          <div className="text-blue-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Events Found</h3>
          <p className="text-gray-600">No events found for this {view}. Create your first event to get started!</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Delete Event</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-2">Are you sure you want to delete this event?</p>
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <p className="font-semibold text-gray-900 truncate">
                  "{deleteConfirmation.eventName}"
                </p>
                <p className="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingEventId === deleteConfirmation.eventId}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-300 disabled:to-red-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
                >
                  {deletingEventId === deleteConfirmation.eventId ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    "Delete Event"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarView
