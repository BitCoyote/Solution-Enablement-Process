import * as winston from 'winston';
export class Logger {
  public logger: winston.Logger;
  constructor() {
    const timestampFirstFormat = winston.format(info => {
      info.message = `${info.timestamp} | ${info.message}`;
      delete info.timestamp;
      return info;
    });
    const transports = [
      new winston.transports.Console({
        silent: process.env.NODE_ENV=== 'test', // Do not print logs when running tests
        format: winston.format.simple()
      })
    ];
    this.logger = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        timestampFirstFormat()
      ),
      transports
    });
  }
}
export default new Logger().logger;
