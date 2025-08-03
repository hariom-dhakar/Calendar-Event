# Google Calendar Integration App

A comprehensive full-stack web application that seamlessly integrates with Google Calendar, allowing users to connect their accounts, view calendar statistics, manage events, and create new events with an intuitive interface.

## 🚀 Features

### Authentication & Security
- **Google OAuth 2.0 Authentication**: Secure login with Google accounts
- **Session Management**: Persistent user sessions with automatic token refresh
- **Protected Routes**: Authentication middleware protecting sensitive endpoints

### Dashboard & Navigation
- **Responsive Dashboard**: Modern, mobile-first design with adaptive navigation
- **Smart Tab System**: Context-aware navigation that adapts based on connection status
- **Real-time Status Indicators**: Live connection status with visual feedback
- **Loading States**: Smooth loading animations and state management

### Calendar Integration
- **Calendar Connection Management**: Easy Google Calendar connection/disconnection
- **Connection Status Monitoring**: Real-time calendar connectivity status
- **Automatic Reconnection**: Seamless token refresh and error handling

### Event Management
- **Interactive Date Selection**: Click any date in Calendar View to create events:
  - Click dates in Month, Week, or Day view
  - Automatic navigation to Create Event tab
  - Pre-filled date selection with visual confirmation
  - Smart timezone handling to prevent date offset issues
- **Event Creation**: Create events directly in Google Calendar with:
  - Separate date and time pickers for better UX
  - Current date/time defaults for quick event creation
  - Duration selection with preset options (30 min to 4 hours)
  - Form validation with future date/time checking
  - Form auto-reset with current date/time after creation
- **Calendar Statistics**: Comprehensive stats including:
  - Total events count
  - Today's events
  - Upcoming events (next month)
  - This week's events
- **Calendar View**: Full calendar display with:
  - Multiple view types (Month, Week, Day)
  - Event visualization with color coding
  - Clickable dates for quick event creation
  - Hover effects and visual indicators
  - Event deletion functionality

### User Experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smart Navigation**: Conditional tab visibility based on connection state
- **Toast Notifications**: Real-time feedback for all user actions
- **Form Auto-fill**: Current date/time defaults for quick event creation
- **Progressive Enhancement**: Graceful degradation for different screen sizes

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Google APIs** for Calendar integration
- **Express Session** with MongoDB store
- **CORS** for cross-origin requests
- **Helmet** for security headers

### Frontend
- **React 18** with TypeScript
- **Vite** for lightning-fast development
- **Tailwind CSS** for utility-first styling
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Context API** for state management
- **Custom Hooks** for reusable logic

### Development & Tooling
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Hot Module Replacement** for instant feedback

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google Cloud Console project with Calendar API enabled
- Google OAuth 2.0 credentials

## 🔧 Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (for development)
   - Note down your Client ID and Client Secret

### 2. Backend Setup

1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Update `.env` with your configuration:
   \`\`\`env
   PORT=5000
   NODE_ENV=development
   SESSION_SECRET=your-super-secret-session-key
   MONGO_URI=mongodb://localhost:27017/google-calendar-app
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   \`\`\`

5. Start the backend server:
   \`\`\`bash
   npm run dev
   \`\`\`

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Update `.env` with your configuration:
   \`\`\`env
   VITE_BACKEND_URL=http://localhost:5000
   \`\`\`

5. Start the frontend development server:
   \`\`\`bash
   npm run dev
   \`\`\`

The frontend will run on `http://localhost:5173`

## 🔑 Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `SESSION_SECRET`: Secret key for session encryption
- `MONGO_URI`: MongoDB connection string
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret
- `GOOGLE_REDIRECT_URI`: OAuth redirect URI
- `FRONTEND_URL`: Frontend application URL

### Frontend (.env)
- `VITE_BACKEND_URL`: Backend API base URL

## 📁 Project Structure

\`\`\`
google-calendar-app/
├── backend/
│   ├── routes/
│   │   ├── auth.js              # Authentication routes & Google OAuth
│   │   └── calendar.js          # Calendar API routes & event management
│   ├── models/
│   │   └── User.js              # User schema with Google tokens
│   ├── config/
│   │   └── googleAuth.js        # Google OAuth 2.0 configuration
│   ├── middleware/
│   │   └── auth.js              # Authentication & session middleware
│   ├── server.js                # Express server setup & configuration
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConnectCalendar.tsx    # Calendar connection management
│   │   │   ├── CreateEvent.tsx        # Event creation form
│   │   │   ├── CalendarView.tsx       # Calendar display component
│   │   │   ├── CalendarStats.tsx      # Statistics dashboard
│   │   │   └── theme-provider.tsx     # Theme management
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx          # Main dashboard with tabs
│   │   │   └── Login.tsx              # Authentication page
│   │   ├── context/
│   │   │   └── AuthContext.tsx        # Global authentication state
│   │   ├── api/
│   │   │   └── api.ts                 # Axios configuration & API calls
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx         # Mobile responsiveness hook
│   │   │   └── use-toast.ts           # Toast notification hook
│   │   ├── lib/
│   │   │   └── utils.ts               # Utility functions
│   │   ├── components/ui/             # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (other UI components)
│   │   ├── App.tsx                    # Main application component
│   │   └── main.tsx                   # Application entry point
│   ├── public/
│   │   └── ... (static assets)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── .env.example
├── components.json                    # shadcn/ui configuration
├── README.md
└── package.json
\`\`\`

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/google` - Get Google OAuth URL
- `GET /api/auth/google/callback` - Handle OAuth callback
- `GET /api/auth/status` - Get user session status
- `POST /api/auth/logout` - Logout user

### Calendar
- `GET /api/calendar/status` - Check calendar connection status
- `POST /api/calendar/events` - Create calendar event

## 🎯 Usage

### Getting Started
1. **Login**: Click "Sign in with Google" to authenticate with your Google account
2. **Dashboard Overview**: View your connection status and calendar statistics
3. **Connect Calendar**: Your calendar is automatically connected after successful login

### Dashboard Navigation
The dashboard features a smart navigation system with four main sections:

#### Overview Tab
- **Connection Status**: Visual indicator of Google Calendar connectivity
- **Calendar Statistics**: Real-time stats showing:
  - Total events in your calendar
  - Events happening today
  - Upcoming events (next month)
  - Events this week
- **Quick Actions**: Direct buttons to access Calendar View and Create Event

#### Connect Calendar Tab (Only visible when not connected)
- **Connection Management**: Easy one-click Google Calendar connection
- **Status Monitoring**: Real-time connection verification
- **Test Connection**: Verify calendar access after connection

#### Calendar View Tab
- **Interactive Calendar Display**: Complete view of your calendar events with clickable dates
- **Multiple View Types**: Switch between Month, Week, and Day views
- **Click-to-Create**: Click any date to instantly create an event for that date
- **Event Management**: View, interact with, and delete calendar events
- **Visual Indicators**: Plus icons and hover effects show clickable dates

#### Create Event Tab
- **Smart Date Selection**: Automatically opens when you click a date in Calendar View
- **Selected Date Indicator**: Blue banner shows which date you're creating an event for
- **Intuitive Form**: Clean, user-friendly event creation interface with:
  - Pre-filled date from calendar selection
  - Current time as default start time
  - Separate date and time pickers for better UX
  - Duration selection dropdown (30 min, 1hr, 1.5hr, 2hr, 3hr, 4hr)
  - Form validation ensuring future dates/times
- **Quick Creation**: Optimized workflow for rapid event scheduling

### Event Creation Process

#### Method 1: Direct Date Selection (Recommended)
1. Navigate to the "Calendar View" tab
2. **Click any date** in Month, Week, or Day view
3. Automatically switches to "Create Event" tab with date pre-selected
4. See blue confirmation banner with selected date
5. Enter event name (required)
6. Adjust time if needed (defaults to current time)
7. Pick duration from dropdown options
8. Click "Create Event" to add to your Google Calendar

#### Method 2: Manual Event Creation
1. Navigate to the "Create Event" tab directly
2. Enter event name (required)
3. Select date (defaults to today)
4. Choose start time (defaults to current time)
5. Pick duration from dropdown options
6. Click "Create Event" to add to your Google Calendar

### Calendar Interaction Features
- **Click-to-Create**: Click any date in calendar views to start creating an event
- **Visual Feedback**: Hover effects and plus icons indicate clickable dates
- **Smart Navigation**: Seamless transitions between calendar view and event creation
- **Date Persistence**: Selected date carries over and displays clearly in the form
- **Timezone Safety**: Robust date handling prevents timezone-related date shifts

### Responsive Experience
- **Mobile**: Streamlined navigation with compact tab names
- **Tablet**: Balanced layout with optimal spacing
- **Desktop**: Full-featured interface with expanded content areas

## 🔒 Security Features

- **Session Management**: Secure session handling with MongoDB store
- **Token Refresh**: Automatic refresh of expired Google tokens
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers for Express
- **Environment Variables**: Sensitive data stored in environment variables

## 🚀 Deployment

### Backend Deployment (Vercel/Railway/Heroku)
1. Set all environment variables in your deployment platform
2. Update `GOOGLE_REDIRECT_URI` to your production callback URL
3. Update `FRONTEND_URL` to your production frontend URL

### Frontend Deployment (Vercel/Netlify)
1. Set `VITE_BACKEND_URL` to your production backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder

## 🐛 Troubleshooting

### Common Issues

1. **OAuth Error**: Make sure your redirect URI matches exactly in Google Console
2. **CORS Error**: Verify frontend URL is correctly set in backend CORS configuration
3. **Token Expired**: The app automatically refreshes tokens, but check your refresh token is valid
4. **MongoDB Connection**: Ensure MongoDB is running and connection string is correct
5. **Date Selection Issues**: If dates appear off by ±1 day, this is likely a timezone issue that has been resolved with local date handling
6. **Calendar View Not Loading**: Ensure Google Calendar API is enabled and your OAuth scope includes calendar access

### Debug Mode
Set `NODE_ENV=development` to see detailed error logs.

## 🌟 Recent Updates

### v2.0 - Interactive Calendar with Date Selection
- ✅ **Click-to-Create Events**: Click any date in calendar views to create events
- ✅ **Enhanced Calendar Views**: Interactive Month, Week, and Day views
- ✅ **Smart Date Handling**: Fixed timezone issues for accurate date selection
- ✅ **Improved UX**: Visual indicators, hover effects, and seamless navigation
- ✅ **Form Pre-population**: Selected dates automatically populate in event creation form
- ✅ **Responsive Design**: Optimized for all screen sizes with mobile-first approach

### v1.0 - Core Features
- ✅ Google OAuth 2.0 Authentication
- ✅ Calendar Connection Management
- ✅ Event Creation with Validation
- ✅ Calendar Statistics Dashboard
- ✅ Responsive Design

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with ❤️ by [Your Name]** - A modern, intuitive Google Calendar integration app with interactive date selection and comprehensive event management.
