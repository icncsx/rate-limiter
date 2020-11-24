import logger from '../helpers/logger';

const errorHandler = (err, req, res, next) => {
  logger.error('Error caught!', err);
  if (!err.isOperational) {
    logger.error(
      'An unexpected error occurred please restart the application!',
      `\nError: ${err.message} Stack: ${err.stack}`
    );
    process.exit(1);
  }
  const ip = req.connection.remoteAddress;
  logger.error(
    `${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${ip} - Stack: ${err.stack}`
  );
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    statusCode: err.statusCode || 500,
    data: err.data,
    stack: err.stack
  };
  return res.status(err.statusCode || 500).jsend.error(errorDetails);
};

export default errorHandler;