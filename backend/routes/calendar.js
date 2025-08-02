const express = require("express");
const {
  createCalendarEvent,
  getCalendarEvents,
  deleteCalendarEvent,
} = require("../config/googleAuth");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Check calendar connection status
router.get("/status", requireAuth, (req, res) => {
  res.json({
    isConnected: req.user.isCalendarConnected,
    message: req.user.isCalendarConnected
      ? "Calendar Connected"
      : "Calendar Not Connected",
  });
});

router.get("/test", requireAuth, async (req, res) => {
  try {
    if (!req.user.accessToken) {
      return res.status(401).json({ error: "No access token" });
    }

    const events = await getCalendarEvents(req.user.accessToken, {
      maxResults: 1,
    });

    res.json({
      success: true,
      message: "Calendar connection test successful",
      eventsCount: events.length,
      user: {
        email: req.user.email,
        hasToken: !!req.user.accessToken,
        tokenExpiry: req.user.tokenExpiry,
        isConnected: req.user.isCalendarConnected,
      },
    });
  } catch (error) {
    console.error("Calendar connection test failed:", error);
    res.status(500).json({
      error: "Calendar connection test failed",
      details: error.message,
      code: error.code,
    });
  }
});

// Create calendar event
router.post("/events", requireAuth, async (req, res) => {
  try {
    const { name, startDateTime, duration } = req.body;

    if (!name || !startDateTime || !duration) {
      return res
        .status(400)
        .json({
          error: "Missing required fields: name, startDateTime, duration",
        });
    }

    const durationMinutes = Number.parseInt(duration, 10);
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      return res
        .status(400)
        .json({ error: "Duration must be a positive number" });
    }

    const startTime = new Date(startDateTime);
    if (isNaN(startTime.getTime())) {
      return res.status(400).json({ error: "Invalid startDateTime format" });
    }

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + durationMinutes);

    const eventData = {
      name,
      startDateTime: startTime.toISOString(),
      endDateTime: endTime.toISOString(),
    };

    const event = await createCalendarEvent(req.user.accessToken, eventData);

    res.json({
      success: true,
      message: "Event Created Successfully",
      event: {
        id: event.id,
        summary: event.summary,
        start: event.start,
        end: event.end,
        htmlLink: event.htmlLink,
      },
    });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    res.status(500).json({
      error: "Failed to create calendar event",
      details: error.message,
    });
  }
});

// Get calendar events
router.get("/events", requireAuth, async (req, res) => {
  try {
    const {
      timeMin,
      timeMax,
      maxResults = 50,
      orderBy = "startTime",
      singleEvents = true,
    } = req.query;

    if (!req.user.isCalendarConnected) {
      return res.status(400).json({ error: "Calendar not connected" });
    }

    if (!req.user.accessToken) {
      return res.status(401).json({ error: "No access token available" });
    }

    if (timeMin && isNaN(Date.parse(timeMin))) {
      return res.status(400).json({ error: "Invalid timeMin format" });
    }
    if (timeMax && isNaN(Date.parse(timeMax))) {
      return res.status(400).json({ error: "Invalid timeMax format" });
    }

    const maxResultsNum = parseInt(maxResults, 10);
    if (isNaN(maxResultsNum) || maxResultsNum < 1 || maxResultsNum > 2500) {
      return res
        .status(400)
        .json({ error: "maxResults must be between 1 and 2500" });
    }

    const events = await getCalendarEvents(req.user.accessToken, {
      timeMin,
      timeMax,
      maxResults: maxResultsNum,
      orderBy,
      singleEvents: singleEvents === "true",
    });

    res.json({
      success: true,
      events: events || [],
      total: events ? events.length : 0,
    });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    console.error("Error stack:", error.stack);

    if (error.code === 401) {
      return res.status(401).json({
        error: "Authentication failed - please reconnect your calendar",
        needsReauth: true,
      });
    }

    if (error.code === 403) {
      return res.status(403).json({
        error: "Access forbidden - insufficient permissions",
      });
    }

    if (error.code === 404) {
      return res.status(404).json({
        error: "Calendar not found",
      });
    }

    res.status(500).json({
      error: "Failed to fetch calendar events",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// Delete calendar event
router.delete("/events/:eventId", requireAuth, async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!req.user.accessToken) {
      return res.status(401).json({
        error: "No access token available",
        needsReauth: true,
      });
    }

    const result = await deleteCalendarEvent(req.user.accessToken, eventId);

    res.json({
      success: true,
      message: "Event deleted successfully",
      eventId: eventId,
    });
  } catch (error) {
    console.error("Delete event error:", error);

    if (error.code === 401) {
      return res.status(401).json({
        error: "Authentication failed - please reconnect your calendar",
        needsReauth: true,
      });
    }

    if (error.code === 403) {
      return res.status(403).json({
        error:
          "Access forbidden - insufficient permissions to delete this event",
      });
    }

    if (error.code === 404) {
      return res.status(404).json({
        error: "Event not found - it may have already been deleted",
      });
    }

    res.status(500).json({
      error: "Failed to delete calendar event",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

module.exports = router;
