"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleUnauthorizedAccessError = (err) => {
    const errorSources = err.errors.map((issue) => {
        return {
            path: issue.path.map(String).join('.'),
            message: issue.message,
            errorDetails: '',
        };
    });
    const statusCode = 401;
    return {
        statusCode,
        message: 'Unauthorized Access',
        errorMessage: 'You do not have the necessary permissions to access this resource.',
        errorSources,
    };
};
exports.default = handleUnauthorizedAccessError;
