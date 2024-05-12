function errorHandler(err, req, res, next) {
    console.error(`Error: ${err.message}`);
    console.error(err.stack);

    if (res.headersSent) {
        // If headers are already sent, delegate to the default Express error handler
        return next(err);
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode);

    const errorResponse = {
        message: err.message || 'An unexpected error occurred',
    };

    // In development, include stack trace for debugging; omit in production
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    res.json(errorResponse);
}

module.exports = errorHandler;
