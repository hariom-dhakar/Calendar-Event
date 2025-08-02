const User = require("../models/User")
const { refreshAccessToken } = require("../config/googleAuth")

const requireAuth = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    const user = await User.findById(req.session.userId)
    if (!user) {
      return res.status(401).json({ error: "User not found" })
    }

    if (user.needsTokenRefresh()) {
      try {

        if (!user.refreshToken) {
          throw new Error("No refresh token available")
        }
        
        const newTokens = await refreshAccessToken(user.refreshToken)
        
        if (!newTokens.access_token) {
          throw new Error("Failed to get new access token")
        }
        
        user.accessToken = newTokens.access_token
        user.tokenExpiry = new Date(newTokens.expiry_date || Date.now() + 3600000) // 1 hour default
        
        if (newTokens.refresh_token) {
          user.refreshToken = newTokens.refresh_token
        }
        
        await user.save()
      } catch (error) {
        console.error("Token refresh failed:", error)
        console.error("Refresh token error details:", error.message)
        
        req.session.destroy(() => {})
        return res.status(401).json({ 
          error: "Token refresh failed - please re-authenticate",
          needsReauth: true,
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
      }
    }

    if (!user.accessToken) {
      return res.status(401).json({ 
        error: "No access token available - please re-authenticate",
        needsReauth: true 
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(500).json({ error: "Authentication error" })
  }
}

module.exports = { requireAuth }
