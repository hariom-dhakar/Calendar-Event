const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const cors = require("cors")
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const calendarRoutes = require("./routes/calendar")

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}))
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://10.25.110.110:5173"
    ]
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log(`CORS blocked origin: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions))

app.use(
  session({
    name: 'calendar-session',
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      touchAfter: 24 * 3600,
      autoRemove: 'native',
      ttl: 24 * 60 * 60,
      stringify: false
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
    },
  }),
)
app.use("/api/auth", authRoutes)
app.use("/api/calendar", calendarRoutes)

app.get("/api/test-session", (req, res) => {
  res.json({
    sessionID: req.sessionID,
    session: req.session,
    userId: req.session?.userId,
    headers: {
      cookie: req.headers.cookie,
      origin: req.headers.origin,
      userAgent: req.headers['user-agent']
    }
  })
})

app.get("/api/health", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState
    const dbStatus = dbState === 1 ? "connected" : "disconnected"
    
    res.json({ 
      status: "OK", 
      message: "Server is running",
      database: dbStatus,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    })
  } catch (error) {
    res.status(500).json({ 
      status: "ERROR", 
      message: "Health check failed",
      error: error.message 
    })
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

module.exports = app;
