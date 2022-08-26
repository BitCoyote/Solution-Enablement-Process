import express from 'express';
import Database from './models/index';
import endpoints, { Endpoint } from './endpoints';
import logger from './utils/logger';
import { checkForPermissionMiddleware } from './utils/authorization';

// This module receives the express app and applies the routes for the entire API.
export default (
  app: express.Application,
  db: Database
) => {
  endpoints.forEach((endpoint) => {
    // Create endpoint in express
    createExpressEndpoint(db, app, endpoint);
  });

};
const createExpressEndpoint = (db: Database, app: express.Application, endpoint: Endpoint) => {
  let activeMiddleware: any[] = [];
  if (endpoint.middleware) {
    activeMiddleware = endpoint.middleware.map((fn) => (req: express.Request, res: express.Response, next: express.NextFunction) => fn(req, res, next, db))
  }
  app[endpoint.method](endpoint.path.replace(/\{/g, ':').replace(/\}/g, ''),
  // Check if the user is authorized to use the endpoint
    (req: express.Request, res: express.Response, next: express.NextFunction) => endpoint.permission ? checkForPermissionMiddleware(res, next, endpoint.permission) : next(),
    // Apply middlware added to endpoint from route file.
    [...activeMiddleware],
    async (req: express.Request, res: express.Response) => {
      /** Wrap the handler in a try/catch block to return a 500 status and log the error if there are any uncaught errors. */
      try {
        await endpoint.handler(req, res, db);
      } catch (err) {
        logger.error(err);
        return res.status(500).send('An unknown error occurred! ¯\_(ツ)_/¯');
      }
    });
}
