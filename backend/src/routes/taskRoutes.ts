import express from 'express';
import {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getTaskStats,
    bulkOperations
} from '../controllers/taskController';

const router = express.Router();

// Base route for all task operations
// All routes are prefixed with /api/tasks

// GET /api/tasks - Get all tasks (with optional filters)
router.get('/', getAllTasks);

// GET /api/tasks/stats - Get task statistics
router.get('/stats', getTaskStats);

// GET /api/tasks/:id - Get single task by ID
router.get('/:id', getTask);

// POST /api/tasks - Create new task
router.post('/', createTask);

// POST /api/tasks/bulk - Bulk operations (delete, update, complete)
router.post('/bulk', bulkOperations);

// PUT /api/tasks/:id - Update task by ID
router.put('/:id', updateTask);

// PATCH /api/tasks/:id/toggle - Toggle task completion status
router.patch('/:id/toggle', toggleTaskCompletion);

// DELETE /api/tasks/:id - Delete task by ID
router.delete('/:id', deleteTask);

export default router; 