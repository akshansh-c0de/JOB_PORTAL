/**
 * Custom Error Class
 * We use this to create errors with specific status codes easily
 * For example: new ErrorHandler("Not Found", 404)
 */
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // This creates a 'stack trace' which helps us find exactly where the error happened
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
