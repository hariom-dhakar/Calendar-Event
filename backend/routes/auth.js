const express = require("express")
const User = require("../models/User")
const { getAuthUrl, getTokens, getUserInfo } = require("../config/googleAuth")
const { requireAuth } = require("../middleware/auth")

const router = express.Router()

// Get Google Auth URL
router.get("/google", (req, res) => {
  try {
    const authUrl = getAuthUrl()
    res.json({ authUrl })
  } catch (error) {
    console.error("Error generating auth URL:", error)
    res.status(500).json({ error: "Failed to generate auth URL" })
  }
})

// Handle Google OAuth callback
router.get("/google/callback", async (req, res) => {
  try {
    const { code, error } = req.query

    if (error) {
      console.error("OAuth error:", error)
      const errorMessages = {
        'access_denied': 'Access was denied. Please try again or contact the developer.',
        'unauthorized_client': 'App is not authorized. Please contact the developer.',
        'invalid_request': 'Invalid OAuth request.',
        'unsupported_response_type': 'OAuth configuration error.',
        'invalid_scope': 'Invalid permissions requested.',
        'server_error': 'Google server error. Please try again.',
        'temporarily_unavailable': 'Service temporarily unavailable. Please try again.'
      }
      const message = errorMessages[error] || 'OAuth authentication failed'
      return res.redirect(`${process.env.FRONTEND_URL}?auth=error&message=${encodeURIComponent(message)}`)
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}?auth=error&message=no_code`)
    }

    const tokens = await getTokens(code)

    if (!tokens.access_token) {
      throw new Error("No access token received")
    }

    const userInfo = await getUserInfo(tokens.access_token)

    let user = await User.findOne({ googleId: userInfo.id })

    if (user) {
      user.accessToken = tokens.access_token
      user.refreshToken = tokens.refresh_token || user.refreshToken
      user.tokenExpiry = new Date(tokens.expiry_date)
      user.isCalendarConnected = true
    } else {
      user = new User({
        googleId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: new Date(tokens.expiry_date),
        isCalendarConnected: true,
      })
    }

    await user.save()

    req.session.userId = user._id
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err)
        return res.redirect(`${process.env.FRONTEND_URL}?auth=error&message=session_error`)
      }
      res.redirect(`${process.env.FRONTEND_URL}?auth=success`)
    })
  } catch (error) {
    console.error("OAuth callback error:", error)
    res.redirect(`${process.env.FRONTEND_URL}?auth=error`)
  }
})

// Get user session status 
router.get("/status", async (req, res) => {
  try {
    // Enhanced debugging for production issues
    const debugInfo = {
      sessionExists: !!req.session,
      sessionID: req.sessionID,
      hasCookies: !!req.headers.cookie,
      hasSessionUserId: !!req.session?.userId,
      origin: req.headers.origin,
      userAgent: req.headers['user-agent']?.substring(0, 50),
      nodeEnv: process.env.NODE_ENV,
      frontendUrl: process.env.FRONTEND_URL
    }
    
    console.log('🔍 Auth status check:', debugInfo)

    if (!req.session.userId) {
      return res.json({
        isAuthenticated: false,
        user: null,
        debug: debugInfo
      })
    }

    // Find user by session
    const user = await User.findById(req.session.userId)
    if (!user) {
      req.session.destroy(() => {})
      return res.json({
        isAuthenticated: false,
        user: null,
        debug: debugInfo
      })
    }

    res.json({
      isAuthenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        isCalendarConnected: user.isCalendarConnected,
      },
      debug: debugInfo
    })
  } catch (error) {
    console.error("Error checking auth status:", error)
    res.status(500).json({
      isAuthenticated: false,
      user: null,
      error: "Failed to check authentication status"
    })
  }
})

// Logout user
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" })
    }
    res.clearCookie("connect.sid")
    res.json({ message: "Logged out successfully" })
  })
})

module.exports = router
