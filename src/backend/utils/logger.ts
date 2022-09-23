import * as winston from 'winston';
export class Logger {
  public logger: winston.Logger;
  constructor() {
    const timestampFirstFormat = winston.format((info) => {
      info.message = `${info.timestamp} | ${info.message}`;
      delete info.timestamp;
      return info;
    });
    const transports = [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ];
    let level = 'debug';
    /* istanbul ignore if */
    if (process.env.NODE_ENV === 'test') {
      level = 'warn';
    }
    this.logger = winston.createLogger({
      level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        timestampFirstFormat()
      ),
      transports,
    });
  }
}
export default new Logger().logger;
