import mongoose, { Document, Schema } from 'mongoose';

// Interface for Task document
export interface ITask extends Document {
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

// Tag schema for embedded documents
const TagSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: true,
        default: '#3b82f6'
    }
}, { _id: false });

// Main Task schema
const TaskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters'],
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function (this: ITask, value: Date) {
                // Due date should not be in the past when creating
                if (value && value < new Date()) {
                    return false;
                }
                return true;
            },
            message: 'Due date cannot be in the past'
        }
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        default: 'To Do'
    },
    tags: {
        type: [TagSchema],
        default: []
    },
    completed: {
        type: Boolean,
        default: false
    },
    recurring: {
        type: String,
        enum: ['None', 'Daily', 'Weekly', 'Monthly'],
        default: 'None'
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

// Index for better query performance
TaskSchema.index({ completed: 1, createdAt: -1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ status: 1 });

// Pre-save middleware to update status based on completion
TaskSchema.pre('save', function (next) {
    if (this.completed && this.status !== 'Done') {
        this.status = 'Done';
    } else if (!this.completed && this.status === 'Done') {
        this.status = 'To Do';
    }
    next();
});

// Static method to get tasks with filters
TaskSchema.statics.findWithFilters = function (filters: any) {
    const query: any = {};

    if (filters.completed !== undefined) {
        query.completed = filters.completed;
    }

    if (filters.priority) {
        query.priority = filters.priority;
    }

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } }
        ];
    }

    return this.find(query).sort({ createdAt: -1 });
};

export const Task = mongoose.model<ITask>('Task', TaskSchema); 