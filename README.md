# Google Calendar Integration App

A full-stack application that integrates with Google Calendar API to allow users to authenticate, create, and manage calendar events with a modern, professional interface.

## 🚀 Features

- **Google OAuth 2.0 Authentication**: Secure login with Google accounts
- **Calendar Integration**: Full Google Calendar API integration
- **Event Management**: Create and delete calendar events
- **Multiple Calendar Views**: Month, week, and day view options
- **Event Statistics**: Visual calendar statistics and insights
- **Real-time Updates**: Instant event creation and deletion
- **Responsive Design**: Clean, modern UI that works on all devices
- **Session Management**: Persistent user sessions with automatic token refresh
- **Professional UI**: Modern gradient design with interactive elements
- **Form Validation**: Smart form validation with user feedback
- **Toast Notifications**: Real-time feedback for user actions

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
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

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

_Built with ❤️ using React, TypeScript, Node.js, and Google Calendar API_
