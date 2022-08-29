import express from 'express';
import Database from './models/index';
import logger from './utils/logger';
import { checkForPermissionMiddleware } from './utils/authorization';
import { OpenAPIV3 } from 'openapi-types';
import userEndpoints from './modules/user/user.routes';
import roleEndpoints from './modules/role/role.routes';

export interface Endpoint {
  /** The path used for the endpoint. Uses swagger path parameters such as "/users/{id}" */
  path: string;
  /** The HTTP method for this endpoint.  */
  method: 'get' | 'post' | 'patch' | 'put' | 'delete'
  /** The permission needed to access the endpoint. If an array is passed, at least 1 of the permissions is needed. */
  permission?: string | string[];
  /** The handler function to be called when this endpoint is hit. */
  handler: (req: express.Request, res: express.Response, db: Database) => Promise<express.Response>;
  /** A list of express middlware functions to be called for this route before the handler. */
  middleware?: ((req: express.Request, res: express.Response, next: express.NextFunction, db: Database) => (void | Promise<void>))[]
  /** 
   * The Open API V3 operation object https://swagger.io/specification/#operationObject
   * Can reference existing Typescript interfaces with $ref
   */
  operationObject: OpenAPIV3.OperationObject;
}


/** All the endpoints in the application combined into a single array. */
export const endpoints: Endpoint[] = [
  ...userEndpoints,
  ...roleEndpoints
];

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
  activeMiddleware = (endpoint.middleware || []).map((fn) => (req: express.Request, res: express.Response, next: express.NextFunction) => fn(req, res, next, db))
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
