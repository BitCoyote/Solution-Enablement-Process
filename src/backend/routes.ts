import express from 'express';
import Database from './models/index';
import logger from './utils/logger';
import { checkForRoleMiddleware } from './utils/authorization';
import { OpenAPIV3 } from 'openapi-types';
import userRoutes from './modules/user/user.routes';
import sepRoutes from './modules/sep/sep.routes';
import taskRoutes from './modules/task/task.routes';
import knockoutRoutes from './modules/knockout/knockout.routes';
import dataFieldRoutes from './modules/data-field/data-field.routes';

export interface Paths extends OpenAPIV3.PathsObject {
  [pattern: string]: CustomPathItemObject | undefined;
}

type CustomPathItemObject = {
  [method in OpenAPIV3.HttpMethods]?: CustomOperationObject;
};
export interface CustomOperationObject extends OpenAPIV3.OperationObject {
  /** The role needed to access the endpoint. If an array is passed, at least 1 of the roles is needed. */
  role?: string | string[];
  /** The handler function to be called when this endpoint is hit. */
  handler: (
    req: express.Request,
    res: express.Response,
    db: Database
  ) => Promise<express.Response>;
  /** A list of express middlware functions to be called for this route before the handler. */
  middleware?: ((
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
    db: Database
  ) => void | Promise<void>)[];
}

/** All the endpoints in the application combined into a single object. */
export const paths: Paths = {
  ...userRoutes,
  ...sepRoutes,
  ...taskRoutes,
  ...knockoutRoutes,
  ...dataFieldRoutes,
};

// This module receives the express app and applies the routes for the entire API.
const routes = (app: express.Application, db: Database) => {
  for (const path in paths) {
    for (const method in paths[path]) {
      createExpressEndpoint(
        db,
        app,
        path,
        method as OpenAPIV3.HttpMethods,
        (paths[path] as CustomPathItemObject)[
          method as OpenAPIV3.HttpMethods
        ] as CustomOperationObject
      );
    }
  }
};
const createExpressEndpoint = (
  db: Database,
  app: express.Application,
  path: string,
  method: OpenAPIV3.HttpMethods,
  operation: CustomOperationObject
) => {
  let activeMiddleware: any[] = [];
  activeMiddleware = (operation.middleware || []).map(
    (fn) =>
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) =>
        fn(req, res, next, db)
  );
  app[method](
    path.replace(/\{/g, ':').replace(/\}/g, ''),
    // Check if the user is authorized to use the endpoint
    (req: express.Request, res: express.Response, next: express.NextFunction) =>
      operation.role
        ? checkForRoleMiddleware(res, next, operation.role)
        : next(),
    // Apply middlware added to endpoint from route file.
    [...activeMiddleware],
    async (req: express.Request, res: express.Response) => {
      /** Wrap the handler in a try/catch block to return a 400 status and log the error if there are any uncaught errors. */
      try {
        await operation.handler(req, res, db);
      } catch (err) {
        logger.error(err);
        return res
          .status(400)
          .send('An unexpected error occurred! ¯\\_(ツ)_/¯ : ' + err);
      }
    }
  );
};

export default routes;
