import { Request, Response, NextFunction } from 'express';

// Custom error class for API errors
export class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Error response interface
interface ErrorResponse {
    success: false;
    error: {
        message: string;
        statusCode: number;
        stack?: string;
    };
}

// Success response interface
interface SuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}

// Type for API responses
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Error handler middleware
export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    });

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new ApiError(404, message);
    }

    // Mongoose duplicate key
    if ((err as any).code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ApiError(400, message);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values((err as any).errors)
            .map((val: any) => val.message)
            .join(', ');
        error = new ApiError(400, message);
    }

    // Default error
    const statusCode = (error as ApiError).statusCode || 500;
    const message = error.message || 'Server Error';

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            statusCode,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

// 404 handler for undefined routes
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
};

// Async error wrapper to catch async errors
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Success response helper
export const sendSuccess = <T>(
    res: Response,
    data: T,
    statusCode: number = 200,
    message?: string
): void => {
    const response: SuccessResponse<T> = {
        success: true,
        data,
        ...(message && { message })
    };

    res.status(statusCode).json(response);
};

// Error response helper
export const sendError = (
    res: Response,
    message: string,
    statusCode: number = 500
): void => {
    const response: ErrorResponse = {
        success: false,
        error: {
            message,
            statusCode
        }
    };

    res.status(statusCode).json(response);
}; 