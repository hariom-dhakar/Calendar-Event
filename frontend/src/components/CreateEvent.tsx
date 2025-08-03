"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

interface EventForm {
  name: string;
  date: string;
  time: string;
  duration: string;
}

interface CreateEventProps {
  selectedDate?: string; // Optional prop for pre-selected date in YYYY-MM-DD format
}

const CreateEvent: React.FC<CreateEventProps> = ({ selectedDate }) => {
  const { user } = useAuth();

  // Get current date and time for defaults and validation
  const now = new Date();
  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD format
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

  const [form, setForm] = useState<EventForm>({
    name: "",
    date: selectedDate || today, // Use selectedDate if provided, otherwise current date
    time: currentTime,
    duration: "30",
  });
  const [loading, setLoading] = useState(false);

  // Update form date when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      setForm(prev => ({
        ...prev,
        name: "", // Clear the name when a new date is selected
        date: selectedDate
      }));
    }
  }, [selectedDate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.isCalendarConnected) {
      toast.error("Please connect your calendar first");
      return;
    }

    if (!form.name || !form.date || !form.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Combine date and time into a datetime string
    const startDateTime = `${form.date}T${form.time}`;

    // Validate that the event is not in the past
    const eventDate = new Date(startDateTime);
    const now = new Date();
    if (eventDate <= now) {
      toast.error("Event time must be in the future");
      return;
    }

    // Additional validation: if date is today, time must be later than current time
    if (form.date === today && form.time <= currentTime) {
      toast.error("Event time must be later than the current time");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/calendar/events", {
        name: form.name,
        startDateTime: startDateTime,
        duration: Number.parseInt(form.duration, 10),
      });

      toast.success(response.data.message);

      // Reset form with current date and time
      const resetNow = new Date();
      const resetToday = resetNow.toISOString().split("T")[0];
      const resetCurrentTime = resetNow.toTimeString().slice(0, 5);

      setForm({
        name: "",
        date: resetToday,
        time: resetCurrentTime,
        duration: "30",
      });
    } catch (error: any) {
      console.error("Error creating event:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details ||
        "Failed to create event";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 sm:p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Create Event
        </h2>
      </div>

      {!user?.isCalendarConnected ? (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg border border-amber-200/50 p-8 sm:p-12 text-center">
          <div className="text-amber-500 mb-6">
            <svg
              className="mx-auto h-16 w-16 sm:h-20 sm:w-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Calendar Not Connected
          </h3>
          <p className="text-gray-600 text-lg">
            Please connect your Google Calendar first to create events.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full animation-delay-150"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full animation-delay-300"></div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="group">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors"
              >
                Event Name 
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Enter event name"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label
                  htmlFor="date"
                  className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors"
                >
                  Event Date 
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={form.date}
                    onChange={handleInputChange}
                    min={today}
                    required
                    className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-gray-900"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="group">
                <label
                  htmlFor="time"
                  className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors"
                >
                  Start Time 
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={form.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-gray-900"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="group">
              <label
                htmlFor="duration"
                className="block text-sm font-semibold text-gray-800 mb-3 group-focus-within:text-blue-600 transition-colors"
              >
                Duration
              </label>
              <div className="relative">
                <select
                  id="duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                  <option value="240">4 hours</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30"></div>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent absolute top-0"></div>
                  </div>
                  <span className="text-lg">Creating Event...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-lg font-semibold">Create Event</span>
                </div>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateEvent;
