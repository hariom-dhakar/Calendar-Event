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

interface CalendarStatsProps {
  currentDate?: Date
}

const CalendarStats: React.FC<CalendarStatsProps> = ({ currentDate = new Date() }) => {
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
  }, [user?.isCalendarConnected, currentDate])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      const now = new Date(currentDate)
      
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
      
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      startOfMonth.setHours(0, 0, 0, 0)
      
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      endOfMonth.setHours(23, 59, 59, 999)
      
      const nextMonth = new Date(now)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      const requests = await Promise.allSettled([
        api.get("/calendar/events", {
          params: {
            timeMin: startOfToday.toISOString(),
            timeMax: endOfToday.toISOString(),
            maxResults: 100,
            singleEvents: true,
          },
        }),
        api.get("/calendar/events", {
          params: {
            timeMin: startOfWeek.toISOString(),
            timeMax: endOfWeek.toISOString(),
            maxResults: 100,
            singleEvents: true,
          },
        }),
        api.get("/calendar/events", {
          params: {
            timeMin: startOfMonth.toISOString(),
            timeMax: endOfMonth.toISOString(),
            maxResults: 100,
            singleEvents: true,
          },
        })
      ])

      const todayEvents = requests[0].status === 'fulfilled' ? requests[0].value.data.events || [] : []
      const weekEvents = requests[1].status === 'fulfilled' ? requests[1].value.data.events || [] : []
      const monthEvents = requests[2].status === 'fulfilled' ? requests[2].value.data.events || [] : []

      setStats({
        todayEvents: todayEvents.length,
        thisWeekEvents: weekEvents.length,
        upcomingEvents: monthEvents.length,
        totalEvents: monthEvents.length, 
      })
    } catch (error) {
      console.error("Error fetching calendar stats:", error)
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
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Calendar Overview - {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </h3>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.todayEvents}</div>
            <div className="text-sm text-gray-600">
              {currentDate.toDateString() === new Date().toDateString() ? "Today" : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.thisWeekEvents}</div>
            <div className="text-sm text-gray-600">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.upcomingEvents}</div>
            <div className="text-sm text-gray-600">
              {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.totalEvents}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarStats
