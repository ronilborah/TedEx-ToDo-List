# Todo Full-Stack Application

A modern, feature-rich Todo application built with Next.js frontend and Express.js backend, featuring TypeScript, MongoDB, and Tailwind CSS.

## 🚀 Features

### Frontend (Next.js)
- **Modern UI** - Beautiful, responsive design with Tailwind CSS
- **Dark/Light Theme** - Complete theme switching functionality
- **Task Management** - Create, read, update, delete tasks
- **Advanced Features** - Tags, priorities, due dates, recurring tasks
- **Search & Filter** - Find tasks quickly with search functionality
- **Responsive Design** - Works perfectly on all devices
- **Animations** - Smooth transitions and hover effects

### Backend (Express.js)
- **RESTful API** - Complete CRUD operations for tasks
- **MongoDB Integration** - NoSQL database with Mongoose ODM
- **TypeScript** - Full type safety and IntelliSense
- **Error Handling** - Centralized error handling with custom error classes
- **Validation** - Request validation and data sanitization
- **CORS** - Cross-origin resource sharing enabled
- **Health Checks** - API health monitoring endpoint

## 🏗️ Project Structure

```
ToDoList/
├── frontend/                    # Next.js application
│   ├── app/                    # App Router pages
│   ├── components/             # React components
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utility functions
│   ├── public/                 # Static assets
│   └── [config files]
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── models/             # MongoDB schemas
│   │   ├── controllers/        # Business logic
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Express middleware
│   │   └── index.ts            # Server entry point
│   └── [config files]
├── package.json                # Root workspace config
└── .env.example               # Environment variables template
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation

### 1. Clone and Setup
```bash
git clone <repository-url>
cd ToDoList
```

### 2. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm install --legacy-peer-deps

# Or install individually
npm install --workspace frontend
npm install --workspace backend
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
```

**Environment Variables:**
```env
# Backend
MONGODB_URI=mongodb://127.0.0.1:27017/todoapp
PORT=6900
NODE_ENV=development

# Frontend (optional)
NEXT_PUBLIC_API_URL=http://localhost:6900/api
```

**Frontend API Integration Setup:**
To enable backend API integration (recommended), create a `.env.local` file in the `frontend/` directory:
```bash
# Create frontend environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:6900/api" > frontend/.env.local
```

This enables:
- MongoDB persistence instead of localStorage
- Multi-device synchronization
- Server-side data storage
- Better data integrity and security

### 4. Start MongoDB
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or start MongoDB manually
mongod
```

## 🏃‍♂️ Development

### Start Both Frontend and Backend
```bash
# From root directory
npm run dev
```

This will start:
- **Frontend**: http://localhost:5600
- **Backend**: http://localhost:6900

### Start Individually
```bash
# Frontend only
npm run dev --workspace frontend

# Backend only
npm run dev --workspace backend
```

## 📚 API Documentation

### Base URL
```
http://localhost:6900/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (with filters) |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/toggle` | Toggle completion |
| GET | `/api/tasks/stats` | Get task statistics |
| POST | `/api/tasks/bulk` | Bulk operations |
| GET | `/health` | Health check |

### Example API Usage
```bash
# Create a task
curl -X POST http://localhost:6900/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Task",
    "description": "Task description",
    "priority": "High"
  }'

# Get all tasks
curl http://localhost:6900/api/tasks

# Get task statistics
curl http://localhost:6900/api/tasks/stats
```

## 🔄 Frontend-Backend Integration

The frontend currently uses localStorage for data persistence. To integrate with the backend:

1. **Uncomment the API hook** in `frontend/hooks/useTasksAPI.ts`
2. **Replace localStorage hooks** with API hooks in your components
3. **Add environment variable** `NEXT_PUBLIC_API_URL=http://localhost:6900/api`
4. **Handle loading states** and error messages

See `frontend/hooks/useTasksAPI.ts` for detailed migration instructions.

## 🧪 Testing

### Backend API Testing
```bash
# Health check
curl http://localhost:6900/health

# Create task
curl -X POST http://localhost:6900/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task"}'

# Get tasks
curl http://localhost:6900/api/tasks
```

### Frontend Testing
1. Open http://localhost:5600
2. Create, edit, and delete tasks
3. Test responsive design on different screen sizes
4. Verify theme switching works

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
npm start
```

### Environment Variables for Production
```env
MONGODB_URI=mongodb://your-production-db-url
PORT=6900
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## 📁 File Structure Details

### Frontend Routes
- `/` → Redirects to `/tasks`
- `/tasks` → View all tasks
- `/add` → Add new task
- `/edit/[id]` → Edit existing task

### Backend Structure
- **Models**: MongoDB schemas with validation
- **Controllers**: Business logic and API handlers
- **Routes**: Express route definitions
- **Middleware**: Error handling and request processing

## 🔧 Configuration

### Frontend Configuration
- **Tailwind CSS**: Custom theme and responsive utilities
- **TypeScript**: Strict type checking
- **Next.js**: App Router with TypeScript
- **Port**: 5600 (configurable in package.json)

### Backend Configuration
- **Express**: CORS, JSON parsing, error handling
- **MongoDB**: Connection pooling, indexes, validation
- **TypeScript**: Strict mode with proper types
- **Port**: 6900 (configurable via environment)

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running: `brew services start mongodb-community`
   - Check connection string in `.env`

2. **Port Already in Use**
   - Change PORT in `.env` file for backend
   - Change port in `frontend/package.json` for frontend
   - Kill existing processes: `lsof -ti:5600 | xargs kill` or `lsof -ti:6900 | xargs kill`

3. **CORS Errors**
   - Verify frontend URL in backend CORS configuration
   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Ensure frontend is running on port 5600

4. **TypeScript Errors**
   - Run `npm install` in both frontend and backend
   - Check TypeScript configuration files
