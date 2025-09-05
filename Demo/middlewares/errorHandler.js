const customLogger = require('../utils/CustomLogger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Call myerror and pass both the error and the request object
  customLogger.myerror(err, req);

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal Server Error' : err.message,
    //...
  });
};

module.exports = errorHandler;