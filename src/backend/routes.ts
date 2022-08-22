import express from 'express';
import Database from './database';
import endpoints, { Endpoint } from './endpoints';

// This module receives the express app and applies the routes for the entire API.
export default (
  app: express.Application,
  db: Database
) => {
  endpoints.forEach((endpoint)=>{
    // Create endpoint in express
    createExpressEndpoint(db,app,endpoint);
  });
};

const createExpressEndpoint = (db: Database, app: express.Application, endpoint: Endpoint) => {
  app[endpoint.method](endpoint.path.replace(/\{/g, ':').replace(/\}/g,''), (req: express.Request, res: express.Response) => endpoint.handler(req, res, db));
}
