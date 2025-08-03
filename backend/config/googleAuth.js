const { google } = require("googleapis")

// Validate required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
  console.error("ERROR: Missing Google OAuth environment variables")
  console.error("Required: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI")
  process.exit(1)
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
)

// Scopes for Google Calendar access
const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/calendar.events", // More specific scope
]

const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
    include_granted_scopes: true,
    state: "security_token_" + Math.random().toString(36).substring(2, 15)
  })
}

const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

const getUserInfo = async (accessToken) => {
  oauth2Client.setCredentials({ access_token: accessToken })
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client })
  const { data } = await oauth2.userinfo.get()
  console.log("User info retrieved:", data)
  return data
}

const refreshAccessToken = async (refreshToken) => {
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  const { credentials } = await oauth2Client.refreshAccessToken()
  return credentials
}

const createCalendarEvent = async (accessToken, eventData) => {
  oauth2Client.setCredentials({ access_token: accessToken })
  const calendar = google.calendar({ version: "v3", auth: oauth2Client })

  // Get user's timezone or default to UTC
  const timeZone = eventData.timeZone || "UTC"

  const event = {
    summary: eventData.name,
    start: {
      dateTime: eventData.startDateTime,
      timeZone: timeZone,
    },
    end: {
      dateTime: eventData.endDateTime,
      timeZone: timeZone,
    },
    description: eventData.description || `Event created via Calendar Integration App`,
  }

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
  })

  return response.data
}

const getCalendarEvents = async (accessToken, options = {}) => {
  try {
    if (!accessToken) {
      throw new Error("Access token is required")
    }

    oauth2Client.setCredentials({ access_token: accessToken })
    const calendar = google.calendar({ version: "v3", auth: oauth2Client })

    const params = {
      calendarId: "primary",
      timeMin: options.timeMin || new Date().toISOString(),
      timeMax: options.timeMax,
      maxResults: options.maxResults || 50,
      singleEvents: options.singleEvents !== false,
    }

    // Only add orderBy if singleEvents is true (Google API requirement)
    if (params.singleEvents) {
      params.orderBy = options.orderBy || "startTime"
    }

    // Remove undefined values
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key])

    const response = await calendar.events.list(params)

    return response.data.items || []
  } catch (error) {
    console.error("Google Calendar API error:", error)
    
    // Re-throw with more context
    if (error.response) {
      const apiError = new Error(`Google Calendar API Error: ${error.response.status} - ${error.response.statusText}`)
      apiError.code = error.response.status
      apiError.details = error.response.data
      throw apiError
    }
    
    throw error
  }
}

const deleteCalendarEvent = async (accessToken, eventId) => {
  try {
    if (!accessToken) {
      throw new Error("Access token is required")
    }

    if (!eventId) {
      throw new Error("Event ID is required")
    }

    oauth2Client.setCredentials({ access_token: accessToken })
    const calendar = google.calendar({ version: "v3", auth: oauth2Client })

    await calendar.events.delete({
      calendarId: "primary",
      eventId: eventId,
    })

    return { success: true, eventId }
  } catch (error) {
    console.error("Google Calendar delete error:", error)
    
    // Re-throw with more context
    if (error.response) {
      const apiError = new Error(`Google Calendar API Error: ${error.response.status} - ${error.response.statusText}`)
      apiError.code = error.response.status
      apiError.details = error.response.data
      throw apiError
    }
    
    throw error
  }
}

module.exports = {
  oauth2Client,
  getAuthUrl,
  getTokens,
  getUserInfo,
  refreshAccessToken,
  createCalendarEvent,
  getCalendarEvents,
  deleteCalendarEvent,
}
