import express from 'express';
import logger from './logger';

// An express middleware function to log HTTP requests received.
const logRequest = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const startHrTime = process.hrtime();
  res.on('finish', () => {
    const statusCode = res.statusCode;
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    logger.info(
      `method: ${req.method} status: ${statusCode} path: ${req.originalUrl} duration: ${elapsedTimeInMs} user: ${res.locals?.user?.preferred_username}`
    );
  });
  next();
};

export default logRequest;
