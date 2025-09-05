// utils/CustomLogger.js

const path = require('path');
const logger = require('./logger'); // The base Winston logger
const { getCurrentUserId } = require('./authUtils'); // Your utility function

const projectRoot = process.cwd();

const customLogger = {
  /**
   * Logs an informational message.
   * @param {string} message The single string message.
   */
  myinfo(message) {
    const logData = {
      userId: getCurrentUserId(),
    };
    logger.info(message, logData);
  },

  /**
   * Logs an error. Handles both simple strings and full Error objects.
   * @param {string|Error} errOrMessage The error to log.
   * @param {object} req The Express request object (only for API errors).
   */
  myerror(errOrMessage, req = {}) {
    const logData = {
      userId: getCurrentUserId(),
    };

    // CASE 1: A simple string was passed (Forced Error)
    if (typeof errOrMessage === 'string') {
      logger.error(errOrMessage, logData);
      return;
    }

    // CASE 2: A full Error object was passed (API Error)
    if (errOrMessage instanceof Error) {
      let shortStack = '';
      if (errOrMessage.stack) {
        shortStack = errOrMessage.stack
          .split('\n')
          .map(line => line.replace(projectRoot, '').replace(/\\/g, '/').trim())
          .join('\n');
      }

      const apiErrorLogData = {
        ...logData,
        method: req.method,
        route: req.originalUrl,
        statusCode: errOrMessage.statusCode || 500,
        stack: shortStack,
      };
      logger.error(errOrMessage.message, apiErrorLogData);
      return;
    }
  },
};

module.exports = customLogger;