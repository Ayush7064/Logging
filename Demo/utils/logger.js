// utils/logger.js

const { createLogger, format, transports } = require('winston');
const PrismaTransport = require('./PrismaTransport');

// =================================================================
// ✨ NEW: A custom format to filter for ONLY a specific log level
// =================================================================
const onlyLevel = (level) => {
  return format((info) => (info.level === level ? info : false))();
};

// Logger Configuration
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    // This transport for `error.log` is correct as is.
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),

    // =================================================================
    // ✨ UPDATED: This transport for `info.log` now has a specific filter
    // =================================================================
    new transports.File({
      filename: 'logs/info.log',
      level: 'info', // Still needed to activate the transport for the 'info' level
      format: format.combine(
        onlyLevel('info'), // This filter ensures ONLY 'info' logs are written
        format.json()
      ),
    }),

    // This transport for `combined.log` remains the same.
    new transports.File({
      filename: 'logs/combined.log',
    }),
    
    // The database transport remains the same.
    new PrismaTransport({
      level: 'info',
    }),
  ],
});

// The console logger remains the same.
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize({ all: true }),
      format.printf(({ level, message, timestamp, userId, route }) => {
        const user = userId ? `[User: ${userId}]` : '';
        const path = route ? `[${route}]` : '';
        return `🧩 [${new Date(timestamp).toLocaleTimeString()}] ${level} ${user} ${path}: ${message}`;
      })
    )
  }));
}

module.exports = logger;