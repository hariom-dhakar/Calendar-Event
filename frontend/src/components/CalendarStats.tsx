"use client"

import React, { useState, useEffect } from "react"
import { api } from "../api/api"
import { useAuth } from "../context/AuthContext"

interface CalendarStats {
  totalEvents: number
  todayEvents: number
  upcomingEvents: number
  thisWeekEvents: number
}

const CalendarStats: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<CalendarStats>({
    totalEvents: 0,
    todayEvents: 0,
    upcomingEvents: 0,
    thisWeekEvents: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.isCalendarConnected) {
      fetchStats()
    }
  }, [user?.isCalendarConnected])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      const now = new Date()
      const startOfToday = new Date(now)
      startOfToday.setHours(0, 0, 0, 0)
      
      const endOfToday = new Date(now)
      endOfToday.setHours(23, 59, 59, 999)
      
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      startOfWeek.setHours(0, 0, 0, 0)
      
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(endOfWeek.getDate() + 6)
      endOfWeek.setHours(23, 59, 59, 999)
      
      const oneMonthFromNow = new Date(now)
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

      // Use Promise.allSettled to handle any individual request failures
      const requests = await Promise.allSettled([
        // Fetch today's events
        api.get("/calendar/events", {
          params: {
            timeMin: startOfToday.toISOString(),
            timeMax: endOfToday.toISOString(),
            maxResults: 100,
            singleEvents: true,
          },
        }),
        // Fetch this week's events
        api.get("/calendar/events", {
          params: {
            timeMin: startOfWeek.toISOString(),
            timeMax: endOfWeek.toISOString(),
            maxResults: 100,
            singleEvents: true,
          },
        }),
        // Fetch upcoming events (next month)
        api.get("/calendar/events", {
          params: {
            timeMin: now.toISOString(),
            timeMax: oneMonthFromNow.toISOString(),
            maxResults: 100,
            singleEvents: true,
          },
        })
      ])

      // Extract results or default to empty arrays
      const todayEvents = requests[0].status === 'fulfilled' ? requests[0].value.data.events || [] : []
      const weekEvents = requests[1].status === 'fulfilled' ? requests[1].value.data.events || [] : []
      const upcomingEvents = requests[2].status === 'fulfilled' ? requests[2].value.data.events || [] : []

      // Log for debugging
      console.log('Calendar Stats Debug:', {
        todayEvents: todayEvents.length,
        weekEvents: weekEvents.length,
        upcomingEvents: upcomingEvents.length,
        requests: requests.map(r => r.status)
      })

      setStats({
        todayEvents: todayEvents.length,
        thisWeekEvents: weekEvents.length,
        upcomingEvents: upcomingEvents.length,
        totalEvents: upcomingEvents.length, // Using upcoming as total for now
      })
    } catch (error) {
      console.error("Error fetching calendar stats:", error)
      // Set error state or show toast
      setStats({
        totalEvents: 0,
        todayEvents: 0,
        upcomingEvents: 0,
        thisWeekEvents: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user?.isCalendarConnected) {
    return null
  }

  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">Calendar Statistics</h3>
        <p className="text-sm text-gray-500">Your calendar activity overview</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-200"></div>
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent absolute top-0"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stats.todayEvents}
            </div>
            <div className="text-sm font-medium text-gray-700 flex items-center justify-center space-x-1">
              <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Today</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200 hover:shadow-md transition-all duration-200">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats.thisWeekEvents}
            </div>
            <div className="text-sm font-medium text-gray-700 flex items-center justify-center space-x-1">
              <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>This Week</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center border border-purple-200 hover:shadow-md transition-all duration-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {stats.upcomingEvents}
            </div>
            <div className="text-sm font-medium text-gray-700 flex items-center justify-center space-x-1">
              <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Upcoming</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center border border-orange-200 hover:shadow-md transition-all duration-200">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {stats.totalEvents}
            </div>
            <div className="text-sm font-medium text-gray-700 flex items-center justify-center space-x-1">
              <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Total</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CalendarStats
