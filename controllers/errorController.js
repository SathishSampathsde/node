const AppError = require("../utils/appError");

function handleCastError(error) {
  const message = `Invalid ${error.path}:${error.value}`;
  return new AppError(message, 400);
}

function handleDuplicateError(error) {
  const fieldName = Object.keys(error.keyPattern)[0]
  const message = `${fieldName} is already exists!`;
  return new AppError(message, 400);
}

function handleValidationError(error) {
  const message = Object.values(error.errors).map(({ message }) => message);
  return new AppError(message, 400);
}

function sendErrorResponse(error, res) {
  error.statusCode = error.statusCode || 500;
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    error: error,
  });
}

module.exports = (error, req, res, next) => {
  if (error.name === "CastError") {
    error = handleCastError(error);
  }
  if (error.name === "ValidationError") {
    error = handleValidationError(error);
  }
  if (error.code === 11000) {
    error = handleDuplicateError(error);
  }
  sendErrorResponse(error, res);
};
