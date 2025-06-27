# Todo Backend API

A robust Express.js backend API for the Todo application, built with TypeScript, MongoDB, and Mongoose.

## 🚀 Features

- **RESTful API** - Complete CRUD operations for tasks
- **TypeScript** - Full type safety and IntelliSense
- **MongoDB** - NoSQL database with Mongoose ODM
- **Error Handling** - Centralized error handling with custom error classes
- **Validation** - Request validation and data sanitization
- **CORS** - Cross-origin resource sharing enabled
- **Logging** - Request logging in development mode
- **Health Checks** - API health monitoring endpoint
- **Bulk Operations** - Support for bulk task operations

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/todoapp
   PORT=6900
   NODE_ENV=development
   ```

3. **Start MongoDB:**
   ```bash
   # macOS (if installed via Homebrew)
   brew services start mongodb-community
   
   # Or start MongoDB manually
   mongod
   ```

## 🏃‍♂️ Development

### Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:6900`

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:6900/api
```

### Authentication
Currently, the API is public (no authentication required).

### Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

## 🔗 API Endpoints

### Tasks

#### Get All Tasks
```http
GET /api/tasks
```

**Query Parameters:**
- `completed` (boolean) - Filter by completion status
- `priority` (string) - Filter by priority (Low, Medium, High)
- `status` (string) - Filter by status (To Do, In Progress, Done)
- `search` (string) - Search in title and description

**Example:**
```bash
curl "http://localhost:6900/api/tasks?completed=false&priority=High"
```

#### Get Single Task
```http
GET /api/tasks/:id
```

#### Create Task
```http
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description",
  "dueDate": "2024-12-31",
  "priority": "Medium",
  "status": "To Do",
  "tags": [
    {
      "name": "Work",
      "color": "#3b82f6"
    }
  ],
  "recurring": "None"
}
```

#### Update Task
```http
PUT /api/tasks/:id
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated title",
  "completed": true
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
```

#### Toggle Task Completion
```http
PATCH /api/tasks/:id/toggle
```

#### Get Task Statistics
```http
GET /api/tasks/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "completed": 5,
    "pending": 3,
    "overdue": 2,
    "completionRate": 50
  }
}
```

#### Bulk Operations
```http
POST /api/tasks/bulk
```

**Request Body:**
```json
{
  "operation": "delete",
  "taskIds": ["id1", "id2", "id3"]
}
```

**Supported Operations:**
- `delete` - Delete multiple tasks
- `update` - Update multiple tasks with data
- `complete` - Mark multiple tasks as completed

### Health Check
```http
GET /health
```

## 🗄️ Database Schema

### Task Model
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  dueDate?: Date;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Done';
  tags: Array<{ name: string; color: string }>;
  completed: boolean;
  recurring?: string;
}
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── models/
│   │   └── Task.ts              # MongoDB schema
│   ├── controllers/
│   │   └── taskController.ts    # Business logic
│   ├── routes/
│   │   └── taskRoutes.ts        # API routes
│   ├── middleware/
│   │   └── errorHandler.ts      # Error handling
│   └── index.ts                 # Server entry point
├── package.json
├── tsconfig.json
└── README-backend.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/todoapp` |
| `PORT` | Server port | `6900` |
| `NODE_ENV` | Environment mode | `development` |

### CORS Configuration
The API allows requests from:
- `http://localhost:5600`
- `http://127.0.0.1:5600`

## 🧪 Testing

### Manual Testing with curl

**Create a task:**
```bash
curl -X POST http://localhost:6900/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "priority": "High"
  }'
```

**Get all tasks:**
```bash
curl http://localhost:6900/api/tasks
```

**Update a task:**
```bash
curl -X PUT http://localhost:6900/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

## 🚨 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request** - Invalid input data
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server errors

All errors include descriptive messages and appropriate HTTP status codes.

## 🔄 Integration with Frontend

The backend is designed to work seamlessly with the Next.js frontend:

1. **CORS** is configured to allow frontend requests from port 5600
2. **API endpoints** match frontend expectations
3. **Data format** is compatible with frontend models
4. **Error responses** are structured for frontend consumption

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
MONGODB_URI=mongodb://your-production-db-url
PORT=6900
NODE_ENV=production
```

## 📝 License

MIT License - see LICENSE file for details. 