import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/api'

interface CalendarStatus {
  isConnected: boolean
  message: string
}

interface TestResult {
  success: boolean
  message: string
  eventsCount?: number
  user?: {
    email: string
    hasToken: boolean
    tokenExpiry: string
    isConnected: boolean
  }
  error?: string
  details?: string
}

const ConnectCalendar: React.FC = () => {
  const { user } = useAuth()
  const [calendarStatus, setCalendarStatus] = useState<CalendarStatus | null>(null)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check calendar status on component mount
  useEffect(() => {
    checkCalendarStatus()
  }, [])

  const checkCalendarStatus = async () => {
    try {
      setLoading(true)
      const response = await api.get('/calendar/status')
      setCalendarStatus(response.data)
    } catch (error: any) {
      console.error('Error checking calendar status:', error)
      setCalendarStatus({
        isConnected: false,
        message: 'Failed to check calendar status'
      })
    } finally {
      setLoading(false)
    }
  }

  const connectCalendar = async () => {
    try {
      setIsConnecting(true)
      
      // Get the Google OAuth URL
      const response = await api.get('/auth/google')
      const { authUrl } = response.data
      
      // Redirect to Google OAuth
      window.location.href = authUrl
    } catch (error: any) {
      console.error('Error connecting calendar:', error)
      alert('Failed to connect calendar. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const testCalendarConnection = async () => {
    try {
      setIsTesting(true)
      const response = await api.get('/calendar/test')
      setTestResult(response.data)
    } catch (error: any) {
      console.error('Error testing calendar:', error)
      setTestResult({
        success: false,
        message: 'Calendar test failed',
        error: error.response?.data?.error || error.message,
        details: error.response?.data?.details
      })
    } finally {
      setIsTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Checking calendar status...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Calendar Connection Status */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Calendar Connection Status
          </h3>
          
          {calendarStatus && (
            <div className={`p-4 rounded-md ${
              calendarStatus.isConnected 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-5 h-5 rounded-full ${
                  calendarStatus.isConnected ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    calendarStatus.isConnected ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {calendarStatus.message}
                  </p>
                  {user && (
                    <p className="text-sm text-gray-600 mt-1">
                      Connected as: {user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            {!calendarStatus?.isConnected && (
              <button
                onClick={connectCalendar}
                disabled={isConnecting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Connect Google Calendar
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={checkCalendarStatus}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Status
            </button>

            {calendarStatus?.isConnected && (
              <button
                onClick={testCalendarConnection}
                disabled={isTesting}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTesting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Testing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Test Connection
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testResult && (
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Connection Test Results
            </h3>
            
            <div className={`p-4 rounded-md ${
              testResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {testResult.success ? (
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    testResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResult.message}
                  </h3>
                  
                  {testResult.success && testResult.user && (
                    <div className="mt-2 text-sm text-green-700">
                      <p>✅ Email: {testResult.user.email}</p>
                      <p>✅ Token Status: {testResult.user.hasToken ? 'Valid' : 'Missing'}</p>
                      <p>✅ Events Found: {testResult.eventsCount || 0}</p>
                      {testResult.user.tokenExpiry && (
                        <p>✅ Token Expires: {new Date(testResult.user.tokenExpiry).toLocaleString()}</p>
                      )}
                    </div>
                  )}
                  
                  {!testResult.success && (
                    <div className="mt-2 text-sm text-red-700">
                      {testResult.error && <p>❌ Error: {testResult.error}</p>}
                      {testResult.details && <p>📋 Details: {testResult.details}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Instructions */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            How to Connect Your Calendar
          </h3>
          
          <div className="prose prose-sm text-gray-600">
            <ol className="list-decimal list-inside space-y-2">
              <li>Click the "Connect Google Calendar" button above</li>
              <li>You'll be redirected to Google to sign in</li>
              <li>Grant permissions to access your calendar</li>
              <li>You'll be redirected back to this page</li>
              <li>Your calendar will be connected and ready to use</li>
            </ol>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> We only request access to create and read calendar events. 
                We never store your calendar data permanently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectCalendar
