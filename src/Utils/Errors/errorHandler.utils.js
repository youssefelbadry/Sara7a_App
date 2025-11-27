export const globalErrorHandler = (err, req, res, next) => {
  const status = err.cause || 500;
  return res.status(status).json({
    message: "Somthing Went Wrong",
    error: err.message,
    stack: err.stack,
  });
};
