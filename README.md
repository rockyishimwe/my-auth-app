# GoalOS - MERN Stack Goal Management Application

A modern, feature-rich goal management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and enhanced with beautiful Iconify icons throughout the entire frontend.

## 🚀 Features

### Core Functionality
- **Goal Management**: Create, read, update, delete goals with rich metadata
- **Smart Filtering**: Filter by context, status, priority, and search
- **Multiple Views**: View goals as cards or in a detailed table
- **Progress Tracking**: Visual progress indicators and milestone tracking
- **Context-Based Organization**: 8 different life contexts (Work, Health, Finance, etc.)
- **Analytics Dashboard**: Comprehensive goal analytics and insights
- **User Authentication**: Secure login/registration with JWT tokens
- **Responsive Design**: Mobile-first design with collapsible sidebar

### Advanced Features
- **Real-time Updates**: Instant UI updates with React Context
- **Toast Notifications**: Non-intrusive feedback system
- **Modal System**: Confirmation dialogs and forms
- **Keyboard Shortcuts**: Productivity shortcuts (utility included)
- **Error Handling**: Comprehensive error boundaries and validation
- **Loading States**: Professional loading indicators throughout

### UI/UX Excellence
- **Iconify Integration**: Complete Solar icon set throughout (500+ icons)
- **Consistent Theming**: CSS variables for maintainable design
- **Smooth Animations**: CSS transitions and micro-interactions
- **Professional Styling**: Modern, clean interface with attention to detail
- **Accessibility**: Semantic HTML and ARIA considerations

## 🛠 Tech Stack

### Frontend
- **React 18**: Modern hooks and concurrent features
- **React Router**: Client-side routing with protected routes
- **Axios**: HTTP client with interceptors
- **Iconify**: 500+ professional icons (Solar set primary)
- **CSS Variables**: Maintainable theming system
- **Context API**: State management for auth, goals, and UI

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework with middleware
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: Secure authentication tokens
- **bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing

### Development Tools
- **Vite**: Lightning-fast build tool
- **ESLint**: Code quality and consistency
- **Git Hooks**: Pre-commit quality checks

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── GoalCard.jsx      # Goal card with icons
│   │   ├── GoalTable.jsx     # Data table with sorting
│   │   ├── Sidebar.jsx        # Navigation with icons
│   │   ├── Toast.jsx          # Notification system
│   │   └── ...              # 20+ components
│   ├── pages/              # Route components
│   │   ├── DashboardPage.jsx  # Main dashboard
│   │   ├── GoalsListPage.jsx # Goal management
│   │   ├── AnalyticsPage.jsx # Analytics dashboard
│   │   └── ...              # 8 pages total
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.jsx   # Authentication state
│   │   ├── GoalsContext.jsx  # Goals & UI state
│   │   └── UIContext.jsx     # UI state management
│   ├── services/           # API services
│   │   └── api.js          # Axios configuration
│   ├── styles/             # CSS styling
│   │   ├── variables.css    # Design tokens
│   │   └── global.css      # Global styles
│   └── utils/              # Utility functions
└── backend/
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routes
    ├── middleware/          # Custom middleware
    └── controllers/        # Request handlers
```

## 🎨 Icon System

### Icon Integration
- **Package**: `@iconify/react`
- **Primary Set**: Solar (modern, consistent)
- **Fallback**: Lucide (when Solar unavailable)
- **Total Icons**: 500+ across all components
- **Sizing Rules**:
  - Inline/Button: 18×18px
  - Sidebar Nav: 22×22px
  - Stat Cards: 28×28px
- **Color System**: CSS variables for theming

### Icon Mapping
| Concept | Solar Icon | Usage |
|----------|-------------|---------|
| Dashboard | `solar:widget-bold` | Navigation |
| Goals | `solar:target-bold` | Multiple |
| Analytics | `solar:chart-bold` | Navigation |
| Profile | `solar:user-circle-bold` | Navigation |
| Settings | `solar:settings-bold` | Navigation |
| Add/Create | `solar:add-circle-bold` | Actions |
| Edit/Update | `solar:pen-bold` | Actions |
| Delete | `solar:trash-bin-trash-bold` | Actions |
| Completed | `solar:check-circle-bold` | Status |
| In-Progress | `solar:clock-circle-bold` | Status |
| Search | `solar:magnifer-bold` | Filters |
| Filter | `solar:filter-bold` | Filters |
| Logout | `solar:logout-bold` | Actions |

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB instance (local or cloud)
- Git for version control

### Installation

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd MERN-STACK
   ```

2. **Install Dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend (.env)
   MONGODB_URI=mongodb://localhost:27017/goalos
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   
   # Frontend (.env)
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📱 Usage Guide

### Goal Management
1. **Create Goals**: Click "New Goal" button or use shortcut
2. **Organize**: Assign contexts (Work, Health, Finance, etc.)
3. **Track Progress**: Update progress manually or mark milestones
4. **Filter & Search**: Find goals quickly with smart filters
5. **Analytics**: View completion rates and productivity insights

### Contexts System
- **Work**: Professional goals and career objectives
- **Health**: Fitness, wellness, and health goals
- **Finance**: Financial targets and budget goals
- **Education**: Learning and skill development
- **Personal**: Personal growth and life goals
- **Relationships**: Social and relationship goals
- **Creativity**: Creative projects and artistic goals
- **Travel**: Travel destinations and experiences

### Priority Levels
- **Critical**: Urgent and important goals
- **High**: Important but not urgent
- **Medium**: Normal priority goals
- **Low**: Nice-to-have goals

## 🔧 Development

### Available Scripts
```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
npm run dev          # Start with nodemon
npm start            # Start production server
npm test             # Run tests
```

### Code Quality
- **ESLint**: Enforced code standards
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit quality checks
- **TypeScript Ready**: Easy migration path

## 🎯 Key Features Deep Dive

### Smart Filtering System
- **Multi-criteria**: Context, status, priority, search
- **Real-time**: Instant filter updates
- **Persistent**: Filters remembered across sessions
- **Combinable**: Multiple filters work together

### Analytics Dashboard
- **Completion Rates**: By context and time period
- **Progress Tracking**: Visual progress indicators
- **Trend Analysis**: Productivity patterns
- **Goal Distribution**: Context and priority breakdowns

### Progress Visualization
- **Progress Rings**: Circular progress indicators
- **Progress Bars**: Linear progress displays
- **Status Badges**: Visual status indicators
- **Milestone Tracking**: Step-by-step progress

## 🔒 Security Features

### Authentication
- **JWT Tokens**: Secure session management
- **Password Hashing**: bcrypt encryption
- **Protected Routes**: Authentication guards
- **Token Refresh**: Automatic token renewal

### Data Validation
- **Input Sanitization**: XSS prevention
- **Schema Validation**: Mongoose validation
- **Error Boundaries**: Graceful error handling
- **Rate Limiting**: API protection

## 🌐 Browser Support

- **Chrome**: 90+ (recommended)
- **Firefox**: 88+ (recommended)
- **Safari**: 14+ (recommended)
- **Edge**: 90+ (recommended)

## 📈 Performance

### Optimization Features
- **Code Splitting**: Lazy-loaded routes
- **Image Optimization**: Efficient icon loading
- **Bundle Analysis**: Optimized dependencies
- **Caching Strategy**: Smart data caching

### Metrics
- **First Load**: <2 seconds on average
- **Navigation**: <500ms between routes
- **Bundle Size**: <1MB optimized
- **Lighthouse Score**: 95+ performance

## 🤝 Contributing

### Development Workflow
1. **Fork Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Standards
- **Follow ESLint Rules**: Consistent code style
- **Write Tests**: Cover new functionality
- **Update Documentation**: Keep README current
- **Semantic Commits**: Clear commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing React framework
- **Iconify**: For the beautiful icon system
- **Mongoose**: For elegant MongoDB object modeling
- **Vite**: For lightning-fast development experience

## 📞 Support

For questions, support, or contributions:
- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)
- **Email**: [your-email@domain.com]

---

**Built with ❤️ using modern web technologies and best practices**
