# GoalOS - Professional Goal Management Platform

A full-stack MERN application for comprehensive goal tracking and management with multiple contexts, categories, and advanced features.

## 🎯 Features

- **Multi-Context Goals**: Track goals across work, health, finance, education, personal, relationships, creativity, and travel
- **Advanced Progress Tracking**: Milestones, notes, progress rings, and automatic progress calculation
- **Priority Management**: Four-level priority system with urgency matrix
- **Activity Tracking**: Comprehensive activity feed with streaks and analytics
- **Responsive Design**: Mobile-first design with desktop and tablet optimizations
- **Real-time Updates**: Optimistic UI updates with instant feedback
- **Search & Filtering**: Advanced search across titles, descriptions, and tags
- **Statistics & Analytics**: Goal completion rates, context breakdowns, and trend analysis
- **Authentication**: JWT-based secure authentication with rate limiting
- **Keyboard Shortcuts**: Power user features for efficient navigation

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **Authentication**: JWT with bcrypt password hashing
- **API**: RESTful endpoints with standardized response format
- **Database**: MongoDB with optimized indexes
- **Validation**: Joi schema validation
- **Error Handling**: Centralized error handling with custom error classes
- **Rate Limiting**: Express-rate-limit for API protection
- **Logging**: Morgan for request logging
- **Security**: Helmet, CORS, input sanitization

### Frontend (React + Vite + CSS Modules)
- **State Management**: Context API with useReducer
- **Routing**: React Router v6
- **Styling**: CSS Modules with design system variables
- **HTTP Client**: Axios with interceptors
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite for fast development and optimized builds

## 📁 Project Structure

```
MERN-STACK/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   ├── tests/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── styles/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16.0.0
- MongoDB (local or MongoDB Atlas)
- npm >= 8.0.0

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd MERN-STACK
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

**Backend (.env)**:
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/goalos
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=30d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Frontend (.env)**:
```env
VITE_API_BASE_URL=http://localhost:8000
```

5. **Start the development servers**

**Backend**:
```bash
cd backend
npm run dev
```

**Frontend**:
```bash
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Health Check: http://localhost:8000/health

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage
```

### Frontend Tests
```bash
cd frontend
npm test                    # Run all tests
npm run test:ui             # Run tests with UI
npm run test:coverage       # Run tests with coverage
```

## 📊 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user
- `PUT /api/users/profile` - Update user profile

### Goals
- `GET /api/goals` - Get user goals (with filters & pagination)
- `POST /api/goals` - Create new goal
- `GET /api/goals/:id` - Get specific goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `PUT /api/goals/:id/progress` - Update goal progress
- `PUT /api/goals/:id/status` - Update goal status
- `POST /api/goals/:id/milestones` - Add milestone
- `PUT /api/goals/:id/milestones/:id` - Toggle milestone
- `DELETE /api/goals/:id/milestones/:id` - Delete milestone
- `POST /api/goals/:id/notes` - Add note
- `DELETE /api/goals/:id/notes/:id` - Delete note
- `GET /api/goals/stats` - Get goal statistics

### Activity
- `GET /api/activity` - Get activity feed (last 20 entries)

## 🎨 Design System

### Color Palette
- **Contexts**: Work (Blue), Health (Green), Finance (Amber), Education (Purple), Personal (Pink), Relationships (Red), Creativity (Orange), Travel (Cyan)
- **Priorities**: Low (Slate), Medium (Blue), High (Amber), Critical (Red)
- **Status**: Active (Blue), In-Progress (Amber), Completed (Green), Archived (Slate)

### Typography
- **Font**: JetBrains Mono
- **Sizes**: 11px, 12px, 13px, 14px, 16px, 20px, 24px, 32px

### Spacing
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px

## ⌨️ Keyboard Shortcuts

- `Ctrl + N` - Create new goal
- `/` - Focus search
- `Escape` - Close modal/panel
- `Ctrl + G` - Go to Goals
- `Ctrl + D` - Go to Dashboard
- `Ctrl + A` - Go to Analytics
- `Ctrl + S` - Go to Settings
- `?` - Show keyboard shortcuts

## 🔧 Configuration

### Database Indexes
The application automatically creates the following MongoDB indexes for optimal performance:
- User indexes: email (unique)
- Goal indexes: user+status, user+context, user+dueDate, user+priority, full-text search
- Activity indexes: user+createdAt, user+type, user+goalId

### Rate Limiting
- **Global**: 100 requests per 15 minutes per IP
- **Auth Routes**: 10 requests per 15 minutes per IP

### Security Features
- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- Rate limiting protection

## 📱 Responsive Design

- **Desktop (>1024px)**: Full sidebar visible
- **Tablet (768-1024px)**: Sidebar collapses to icon-only (48px wide)
- **Mobile (<768px)**: Sidebar hidden, hamburger in topbar

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build frontend: `npm run build` (in frontend directory)
3. Start backend: `npm start` (serves frontend static files)

### Environment Variables for Production
```env
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/goalos
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRES_IN=30d
NODE_ENV=production
CLIENT_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- Vite for the fast build tool
- All contributors and users of GoalOS

## 📞 Support

For support, please email support@goalos.com or create an issue in the GitHub repository.
