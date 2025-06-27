import { Request, Response } from 'express';
import { Task, ITask } from '../models/Task';
import { asyncHandler, sendSuccess, sendError, ApiError } from '../middleware/errorHandler';

// Request interfaces for type safety
interface CreateTaskRequest extends Request {
    body: {
        title: string;
        description?: string;
        dueDate?: string;
        priority?: 'Low' | 'Medium' | 'High';
        status?: 'To Do' | 'In Progress' | 'Done';
        tags?: Array<{ name: string; color: string }>;
        recurring?: string;
    };
}

interface UpdateTaskRequest extends Request {
    body: Partial<{
        title: string;
        description: string;
        dueDate: string;
        priority: 'Low' | 'Medium' | 'High';
        status: 'To Do' | 'In Progress' | 'Done';
        tags: Array<{ name: string; color: string }>;
        completed: boolean;
        recurring: string;
    }>;
}

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
    const { completed, priority, status, search } = req.query;

    // Build filter object
    const filters: any = {};

    if (completed !== undefined) {
        filters.completed = completed === 'true';
    }

    if (priority) {
        filters.priority = priority;
    }

    if (status) {
        filters.status = status;
    }

    if (search) {
        filters.$or = [
            { title: { $regex: search as string, $options: 'i' } },
            { description: { $regex: search as string, $options: 'i' } }
        ];
    }

    const tasks = await Task.find(filters).sort({ createdAt: -1 });

    sendSuccess(res, tasks, 200, `Found ${tasks.length} tasks`);
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
export const getTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        throw new ApiError(404, 'Task not found');
    }

    sendSuccess(res, task, 200, 'Task retrieved successfully');
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
export const createTask = asyncHandler(async (req: CreateTaskRequest, res: Response) => {
    const { title, description, dueDate, priority, status, tags, recurring } = req.body;

    // Validate required fields
    if (!title || title.trim().length === 0) {
        throw new ApiError(400, 'Title is required');
    }

    // Prepare task data
    const taskData: Partial<ITask> = {
        title: title.trim(),
        description: description?.trim() || '',
        priority: priority || 'Medium',
        status: status || 'To Do',
        tags: tags || [],
        completed: false,
        recurring: recurring || 'None'
    };

    // Add due date if provided
    if (dueDate) {
        const parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate.getTime())) {
            throw new ApiError(400, 'Invalid due date format');
        }
        taskData.dueDate = parsedDueDate;
    }

    const task = await Task.create(taskData);

    sendSuccess(res, task, 201, 'Task created successfully');
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = asyncHandler(async (req: UpdateTaskRequest, res: Response) => {
    const { title, description, dueDate, priority, status, tags, completed, recurring } = req.body;

    // Find task first
    const task = await Task.findById(req.params.id);

    if (!task) {
        throw new ApiError(404, 'Task not found');
    }

    // Prepare update data
    const updateData: Partial<ITask> = {};

    if (title !== undefined) {
        if (!title || title.trim().length === 0) {
            throw new ApiError(400, 'Title cannot be empty');
        }
        updateData.title = title.trim();
    }

    if (description !== undefined) {
        updateData.description = description.trim();
    }

    if (dueDate !== undefined) {
        if (dueDate) {
            const parsedDueDate = new Date(dueDate);
            if (isNaN(parsedDueDate.getTime())) {
                throw new ApiError(400, 'Invalid due date format');
            }
            updateData.dueDate = parsedDueDate;
        } else {
            updateData.dueDate = undefined;
        }
    }

    if (priority !== undefined) {
        updateData.priority = priority;
    }

    if (status !== undefined) {
        updateData.status = status;
    }

    if (tags !== undefined) {
        updateData.tags = tags;
    }

    if (completed !== undefined) {
        updateData.completed = completed;
    }

    if (recurring !== undefined) {
        updateData.recurring = recurring;
    }

    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
    );

    sendSuccess(res, updatedTask, 200, 'Task updated successfully');
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        throw new ApiError(404, 'Task not found');
    }

    await Task.findByIdAndDelete(req.params.id);

    sendSuccess(res, null, 200, 'Task deleted successfully');
});

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/toggle
// @access  Public
export const toggleTaskCompletion = asyncHandler(async (req: Request, res: Response) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        throw new ApiError(404, 'Task not found');
    }

    task.completed = !task.completed;
    await task.save();

    sendSuccess(res, task, 200, `Task marked as ${task.completed ? 'completed' : 'incomplete'}`);
});

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Public
export const getTaskStats = asyncHandler(async (req: Request, res: Response) => {
    const [totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([
        Task.countDocuments(),
        Task.countDocuments({ completed: true }),
        Task.countDocuments({ completed: false, status: { $ne: 'Done' } }),
        Task.countDocuments({
            completed: false,
            dueDate: { $lt: new Date() }
        })
    ]);

    const stats = {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        overdue: overdueTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };

    sendSuccess(res, stats, 200, 'Task statistics retrieved successfully');
});

// @desc    Bulk operations
// @route   POST /api/tasks/bulk
// @access  Public
export const bulkOperations = asyncHandler(async (req: Request, res: Response) => {
    const { operation, taskIds, data } = req.body;

    if (!operation || !taskIds || !Array.isArray(taskIds)) {
        throw new ApiError(400, 'Invalid bulk operation parameters');
    }

    let result;

    switch (operation) {
        case 'delete':
            result = await Task.deleteMany({ _id: { $in: taskIds } });
            sendSuccess(res, { deletedCount: result.deletedCount }, 200, 'Tasks deleted successfully');
            break;

        case 'update':
            if (!data) {
                throw new ApiError(400, 'Update data is required for bulk update');
            }
            result = await Task.updateMany(
                { _id: { $in: taskIds } },
                data,
                { runValidators: true }
            );
            sendSuccess(res, { modifiedCount: result.modifiedCount }, 200, 'Tasks updated successfully');
            break;

        case 'complete':
            result = await Task.updateMany(
                { _id: { $in: taskIds } },
                { completed: true, status: 'Done' }
            );
            sendSuccess(res, { modifiedCount: result.modifiedCount }, 200, 'Tasks marked as completed');
            break;

        default:
            throw new ApiError(400, 'Invalid operation. Supported operations: delete, update, complete');
    }
}); 