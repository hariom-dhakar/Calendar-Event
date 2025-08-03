const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: false, // Changed from true - refresh tokens aren't always provided
    },
    tokenExpiry: {
      type: Date,
      required: true,
    },
    isCalendarConnected: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Method to check if token needs refresh
userSchema.methods.needsTokenRefresh = function () {
  return new Date() >= this.tokenExpiry
}

module.exports = mongoose.model("User", userSchema)
