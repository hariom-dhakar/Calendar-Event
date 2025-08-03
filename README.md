# Google Calendar Integration App

# Google Calendar Integration App

A full-stack application that integrates with Google Calendar API to allow users to authenticate and create calendar events.

## 🚀 Features

- Google OAuth2 authentication
- Calendar connection status
- Create calendar events with custom duration
- Responsive design with Tailwind CSS
- Real-time notifications with toast messages
- Secure session management
- Token refresh handling

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Google APIs** for calendar integration
- **Express Session** with MongoDB store
- **Helmet** for security headers
- **CORS** for cross-origin requests

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Google Cloud Console** project with Calendar API enabled

## ⚙️ Setup Instructions

### 1. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Create OAuth2 credentials:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
   - Note down Client ID and Client Secret

### 2. Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   # MongoDB Configuration
   MONGO_URI=mongodb://localhost:27017/google-calendar-app
   # OR for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

   # Session Configuration
   SESSION_SECRET=your-super-secret-session-key

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Frontend URL
   FRONTEND_URL=http://localhost:5173

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
   ```

4. Start MongoDB (if using local installation):
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## 🏃‍♂️ Running the Application

1. Start the backend server (runs on port 5000)
2. Start the frontend development server (runs on port 5173)
3. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
google-calendar-app/
├── backend/
│   ├── config/
│   │   └── googleAuth.js          # Google API configuration
│   ├── middleware/
│   │   └── auth.js                # Authentication middleware
│   ├── models/
│   │   └── User.js                # User model
│   ├── routes/
│   │   ├── auth.js                # Authentication routes
│   │   └── calendar.js            # Calendar routes
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Main server file
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.ts             # API client configuration
│   │   ├── components/
│   │   │   ├── ConnectCalendar.tsx
│   │   │   └── CreateEvent.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx    # Authentication context
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Login.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts          # TypeScript declarations
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `GET /api/auth/google` - Get Google OAuth URL
- `GET /api/auth/google/callback` - Handle OAuth callback
- `GET /api/auth/status` - Get current user status
- `POST /api/auth/logout` - Logout user

### Calendar
- `GET /api/calendar/status` - Check calendar connection
- `POST /api/calendar/events` - Create calendar event

### Health
- `GET /api/health` - Server health check

## 🛡️ Security Features

- Helmet.js for security headers
- CORS configuration
- Session-based authentication
- Token refresh handling
- Input validation
- Environment variable validation

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify database permissions

2. **Google OAuth Error**
   - Verify Google Cloud credentials
   - Check redirect URI configuration
   - Ensure Calendar API is enabled

3. **CORS Issues**
   - Check frontend URL in backend CORS configuration
   - Verify FRONTEND_URL environment variable

4. **Token Refresh Issues**
   - Ensure refresh_token is stored properly
   - Check Google OAuth settings (offline access)

## 📝 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/google-calendar-app
SESSION_SECRET=your-session-secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [React Documentation](https://reactjs.org/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🚀 Features

- **Google OAuth 2.0 Authentication**: Secure login with Google accounts
- **Calendar Connection Status**: Real-time status of calendar connectivity
- **Event Creation**: Create events directly in Google Calendar
- **Session Management**: Persistent user sessions with automatic token refresh
- **Responsive Design**: Clean, modern UI that works on all devices

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Google APIs** for Calendar integration
- **Express Session** for session management
- **CORS** for cross-origin requests

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Router** for navigation
- **React Hot Toast** for notifications

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
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── calendar.js      # Calendar API routes
│   ├── models/
│   │   └── User.js          # User model
│   ├── config/
│   │   └── googleAuth.js    # Google OAuth configuration
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── server.js            # Express server setup
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConnectCalendar.tsx
│   │   │   └── CreateEvent.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Login.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── api/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
└── README.md
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

1. **Login**: Click "Sign in with Google" to authenticate
2. **Connect Calendar**: The calendar is automatically connected after login
3. **Create Events**: 
   - Go to the "Create Event" tab
   - Fill in event name, date/time, and duration
   - Click "Create Event" to add it to your Google Calendar

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

### Debug Mode
Set `NODE_ENV=development` to see detailed error logs.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.
