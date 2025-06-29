# Todo Application

A modern, feature-rich Todo application built with Next.js, featuring TypeScript and Tailwind CSS. All data is persisted using the backend API (or localStorage if backend is not available).

## 🚀 Features

- **Modern UI** - Beautiful, responsive design with Tailwind CSS
- **Dark/Light Theme** - Complete theme switching functionality
- **Task Management** - Create, read, update, delete tasks
- **Advanced Features** - Tags, priorities, due dates, recurring tasks
- **Search & Filter** - Find tasks quickly with search functionality
- **Grid View** - Alternative view mode with sortable and filterable task cards
- **Responsive Design** - Works perfectly on all devices
- **Animations** - Smooth transitions and hover effects
- **Local Storage** - All data persists in your browser
- **Offline Capable** - Works without internet connection

## 🏗️ Project Structure

```
ToDoList/
├── frontend/                    # Next.js application
│   ├── app/                    # App Router pages
│   │   ├── tasks/              # Main task list page
│   │   ├── add/                # Add new task page
│   │   ├── edit/[id]/          # Edit task page
│   │   └── view/               # Grid view page
│   ├── components/             # React components
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utility functions
│   ├── public/                 # Static assets
│   └── [config files]
└── package.json                # Root workspace config
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation

### 1. Clone and Setup
```bash
git clone <repository-url>
cd ToDoList
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install
```

### 3. Start Development Server
```bash
# From the frontend directory
npm run dev
```

The application will be available at: **http://localhost:5600** (default)

> **Note:** The development server runs on port 5600 by default. You can change this in `frontend/package.json` if needed.

## 🏃‍♂️ Development

### Available Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

## 📱 Usage

### Main Features
- **Tasks Page** (`/tasks`) - View and manage all your tasks
- **Add Task** (`/add`) - Create new tasks with full details
- **Edit Task** (`/edit/[id]`) - Modify existing tasks
- **Grid View** (`/view`) - Alternative card-based view with sorting and filtering

### Data Persistence
- All tasks are saved using the backend API for reliability and cross-device access
- Data persists across browser sessions and page refreshes
- If the backend is unavailable, tasks may fall back to localStorage (if implemented)

### Navigation
- Use the dock on the right side for quick navigation
- Back button in grid view returns to main tasks page
- Responsive design works on all screen sizes

## 🎨 Customization

### Themes
- Toggle between light and dark themes using the theme button in the dock
- Theme preference is saved in localStorage

### Backgrounds
- Animated background effects
- Background preferences are saved in localStorage

## 🔧 Technical Details

### Built With
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **localStorage** - Client-side data persistence

### Browser Compatibility
- Modern browsers with localStorage support
- No internet connection required after initial load
- Progressive Web App ready

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
