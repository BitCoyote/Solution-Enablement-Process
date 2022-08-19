import express from 'express';
import logger from './logger';
import logResponseTime from './request-timer';

// An express middleware function to log HTTP requests received.
export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  logResponseTime(res)
    .then((meta: any) => {
      logger.info(
        `method: ${req.method} status: ${meta.statusCode} path: ${req.originalUrl} duration: ${meta.elapsedTimeInMs} user: ${res.locals?.user?.preferred_username}`
      );
    })
    .catch((error: Error) => {
      logger.error(error);
    });
  next();
};
