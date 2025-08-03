const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: String,
    username: { type: String, unique: true },
    picture: String,
    accessToken: String,
    refreshToken: String,
    tokenExpiry: Date,
    isCalendarConnected: Boolean,
  },
  {
    timestamps: true,
  }
);

// Method to check if token needs refresh
userSchema.methods.needsTokenRefresh = function () {
  return new Date() >= this.tokenExpiry;
};

module.exports = mongoose.model("User", userSchema);
