/**
 * Global Error Middleware
 * This catches every error that happens in our application and sends a clean JSON response
 */
const errorMiddleware = (err, req, res, next) => {
  // If the error doesn't have a status code, we use 500 (Internal Server Error)
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Something went wrong on the server';

  // Handling specific MongoDB errors
  
  // 1. Invalid Database ID Error (CastError)
  if (err.name === 'CastError') {
    err.message = `Resource not found. Invalid ID format: ${err.path}`;
    err.statusCode = 400;
  }

  // 2. Duplicate Key Error (e.g. Email already exists)
  if (err.code === 11000) {
    err.message = `Duplicate ${Object.keys(err.keyValue)} entered. Please use another one.`;
    err.statusCode = 400;
  }

  // Sending the final error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    // We only show the stack trace if we are in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorMiddleware;
