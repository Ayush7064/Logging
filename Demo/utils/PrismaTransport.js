const Transport = require('winston-transport');
const { PrismaClient } = require('@prisma/client');

class PrismaTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.prisma = new PrismaClient();
  }

  async log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const { level, message, userId, method, route, statusCode, stack } = info;

    try {
      await this.prisma.log.create({
        data: {
          level,
          message,
          userId,
          method,
          route,
          statusCode,
          stack,
        },
      });
    } catch (error) {
      console.error('Error writing log to Prisma:', error);
    }

    callback();
  }
}

module.exports = PrismaTransport;