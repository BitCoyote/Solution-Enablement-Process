import express from 'express';
import Database from './database';
import { OpenAPIV3 } from 'openapi-types';
import userEndpoints from './modules/user/user.routes';

export interface Endpoint {
    /** The path used for the endpoint. Uses swagger path parameters such as "/users/{id}" */
    path: string;
    /** The HTTP method for this endpoint.  */
    method: 'get' | 'post' | 'patch' | 'put' | 'delete'
    /** The permission needed to access the endpoint. If an array is passed, at least 1 of the permissions is needed. */
    permission?: string | string[];
    /** The handler function to be called when this endpoint is hit. */
    handler: (req: express.Request, res: express.Response, db: Database) => Promise<express.Response>;
    /** 
     * The Open API V3 operation object https://swagger.io/specification/#operationObject
     * Can reference existing Typescript interfaces with $ref
     */
    operationObject: OpenAPIV3.OperationObject;
  }
  

/** All the endpoints in the application combined into a single array. */
const allEndpoints: Endpoint[] = [
    ...userEndpoints
];
export default allEndpoints;
