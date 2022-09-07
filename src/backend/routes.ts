import express from 'express';
import Database from './models/index';
import logger from './utils/logger';
import { checkForPermissionMiddleware } from './utils/authorization';
import { OpenAPIV3 } from 'openapi-types';
import userPaths from './modules/user/user.routes';
import rolePaths from './modules/role/role.routes';

export interface Paths extends OpenAPIV3.PathsObject {
  [pattern: string]: CustomPathItemObject | undefined;
}

type CustomPathItemObject = {
  [method in OpenAPIV3.HttpMethods]?: CustomOperationObject;
}
export interface CustomOperationObject extends OpenAPIV3.OperationObject {
  /** The permission needed to access the endpoint. If an array is passed, at least 1 of the permissions is needed. */
  permission?: string | string[];
  /** The handler function to be called when this endpoint is hit. */
  handler: (req: express.Request, res: express.Response, db: Database) => Promise<express.Response>;
  /** A list of express middlware functions to be called for this route before the handler. */
  middleware?: ((req: express.Request, res: express.Response, next: express.NextFunction, db: Database) => (void | Promise<void>))[]
}

/** All the endpoints in the application combined into a single object. */
export const paths: Paths = {
  ...userPaths,
  ...rolePaths
};

// This module receives the express app and applies the routes for the entire API.
export default (
  app: express.Application,
  db: Database
) => {
  for (const path in paths) {
    for (const method in paths[path]) {
      createExpressEndpoint(db, app, path, method as OpenAPIV3.HttpMethods, (paths[path] as CustomPathItemObject)[method as OpenAPIV3.HttpMethods] as CustomOperationObject);

    }
  }

};
const createExpressEndpoint = (db: Database, app: express.Application, path: string, method: OpenAPIV3.HttpMethods, operation: CustomOperationObject) => {
  let activeMiddleware: any[] = [];
  activeMiddleware = (operation.middleware || []).map((fn) => (req: express.Request, res: express.Response, next: express.NextFunction) => fn(req, res, next, db))
  app[method](path.replace(/\{/g, ':').replace(/\}/g, ''),
    // Check if the user is authorized to use the endpoint
    (req: express.Request, res: express.Response, next: express.NextFunction) => operation.permission ? checkForPermissionMiddleware(res, next, operation.permission) : next(),
    // Apply middlware added to endpoint from route file.
    [...activeMiddleware],
    async (req: express.Request, res: express.Response) => {
      /** Wrap the handler in a try/catch block to return a 500 status and log the error if there are any uncaught errors. */
      try {
        await operation.handler(req, res, db);
      } catch (err) {
        logger.error(err);
        return res.status(500).send('An unknown error occurred! ¯\\_(ツ)_/¯');
      }
    });
}
