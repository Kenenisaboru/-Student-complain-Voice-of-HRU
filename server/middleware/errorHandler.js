const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for development
    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', err);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `A record with this ${field} already exists.`
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: messages.join('. ')
        });
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Resource not found. Invalid ID format.'
        });
    }

    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB.'
        });
    }

    // Multer file count error
    if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
            success: false,
            message: 'Too many files. Maximum is 3 files.'
        });
    }

    // Default error
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;
