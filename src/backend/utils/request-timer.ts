import * as express from 'express';
import logger from './logger';

export const logResponseTime = (res: express.Response) =>
  new Promise((resolve, reject) => {
    try {
      const startHrTime = process.hrtime();

      res.on('finish', () => {
        const statusCode = res.statusCode;
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs =
          elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

        resolve({
          statusCode,
          elapsedTimeInMs
        });
      });
    } catch (error) {
      reject(error);
    }
  });

export default logResponseTime;

// Logs the timing of an external request made using the request-promise library.
export const logHTTPRequestTime = (res: any) => {
  logger.info(
    'External HTTP Request to ' +
      res.request.uri.href +
      ' with status ' +
      res.statusCode +
      ' took ' +
      res.elapsedTime +
      'ms'
  );
  return res;
};
