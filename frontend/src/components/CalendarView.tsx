"use client";

import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import CalendarStats from "./CalendarStats";
import toast from "react-hot-toast";

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  description?: string;
  htmlLink: string;
  colorId?: string;
}

type ViewType = "month" | "week" | "day";

const CalendarView: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");

  const fetchEvents = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      const response = await api.get("/calendar/events", {
        params: {
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          maxResults: 50,
          orderBy: "startTime",
          singleEvents: "true",
        },
      });
      setEvents(response.data.events || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch calendar events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await api.delete(`/calendar/events/${eventId}`);
      toast.success("Event deleted successfully");

      const { start, end } = getDateRange();
      fetchEvents(start, end);
    } catch (error: any) {
      console.error("Error deleting event:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to delete event";
      toast.error(errorMessage);
    }
  };

  const getDateRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    switch (view) {
      case "month":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "week":
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case "day":
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start, end };
  };

  useEffect(() => {
    if (user?.isCalendarConnected) {
      const { start, end } = getDateRange();
      fetchEvents(start, end);
    }
  }, [currentDate, view, user?.isCalendarConnected]);

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (date: Date) => {
    switch (view) {
      case "month":
        return date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      case "week":
        const weekStart = new Date(date);
        const dayOfWeek = weekStart.getDay();
        weekStart.setDate(weekStart.getDate() - dayOfWeek);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return `${weekStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${weekEnd.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "day":
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(
        event.start.dateTime || event.start.date || ""
      );
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const renderMonthView = () => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());

    const days = [];
    const currentDateObj = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const date = new Date(currentDateObj);
      const dayEvents = getEventsForDate(date);
      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={date.toISOString()}
          className={`min-h-[120px] p-2 border border-gray-200 ${
            isCurrentMonth ? "bg-white" : "bg-gray-50"
          } ${isToday ? "bg-blue-50 border-blue-300" : ""}`}
        >
          <div
            className={`text-sm font-medium ${
              isCurrentMonth ? "text-gray-900" : "text-gray-400"
            } ${isToday ? "text-blue-600" : ""}`}
          >
            {date.getDate()}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="group relative text-xs p-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                <div
                  className="truncate cursor-pointer pr-6"
                  title={event.summary}
                  onClick={() => window.open(event.htmlLink, "_blank")}
                >
                  {event.summary}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEvent(event.id);
                  }}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity"
                  title="Delete event"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );

      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">{days}</div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={date.toISOString()}
          className="flex-1 min-h-[500px] border-r border-gray-200 last:border-r-0"
        >
          <div
            className={`p-3 text-center border-b border-gray-200 ${
              isToday ? "bg-blue-50 text-blue-600 font-semibold" : "bg-gray-50"
            }`}
          >
            <div className="text-sm">
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </div>
            <div
              className={`text-lg ${
                isToday
                  ? "bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                  : ""
              }`}
            >
              {date.getDate()}
            </div>
          </div>
          <div className="p-2 space-y-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="group relative p-2 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
              >
                <div
                  className="cursor-pointer pr-6"
                  title={event.summary}
                  onClick={() => window.open(event.htmlLink, "_blank")}
                >
                  <div className="font-medium truncate">{event.summary}</div>
                  {event.start.dateTime && (
                    <div className="text-xs">
                      {new Date(event.start.dateTime).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEvent(event.id);
                  }}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity"
                  title="Delete event"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex">{days}</div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {hours.map((hour) => (
            <div key={hour} className="flex border-b border-gray-100">
              <div className="w-20 p-2 text-sm text-gray-500 text-right">
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? "12 PM"
                  : `${hour - 12} PM`}
              </div>
              <div className="flex-1 p-2 min-h-[60px]">
                {dayEvents
                  .filter((event) => {
                    if (!event.start.dateTime) return false;
                    const eventHour = new Date(event.start.dateTime).getHours();
                    return eventHour === hour;
                  })
                  .map((event) => (
                    <div
                      key={event.id}
                      className="group relative p-2 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 mb-1"
                    >
                      <div
                        className="cursor-pointer pr-6"
                        onClick={() => window.open(event.htmlLink, "_blank")}
                      >
                        <div className="font-medium">{event.summary}</div>
                        {event.start.dateTime && (
                          <div className="text-xs">
                            {new Date(event.start.dateTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                            {event.end.dateTime &&
                              ` - ${new Date(
                                event.end.dateTime
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}`}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEvent(event.id);
                        }}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity"
                        title="Delete event"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!user?.isCalendarConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-500 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Calendar Not Connected
        </h3>
        <p className="text-gray-600">
          Please connect your Google Calendar to view events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CalendarStats currentDate={currentDate} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={navigatePrevious}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={navigateNext}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {formatDate(currentDate)}
          </h2>
        </div>

        <div className="flex rounded-md shadow-sm">
          {(["month", "week", "day"] as ViewType[]).map((viewType) => (
            <button
              key={viewType}
              onClick={() => setView(viewType)}
              className={`px-4 py-2 text-sm font-medium border first:rounded-l-md last:rounded-r-md ${
                view === viewType
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              } transition-colors`}
            >
              {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && (
        <>
          {view === "month" && renderMonthView()}
          {view === "week" && renderWeekView()}
          {view === "day" && renderDayView()}
        </>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No events found for this {view}.</p>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
