import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { OpenAPIV3 } from "openapi-types";
import {endpoints} from './routes';
const fs = require('fs');
const path = require('path');
export default (app: express.Application) => {
  // Create Open API documentation for all the endpoints in the application.
  const paths: OpenAPIV3.PathsObject = {};
  endpoints.forEach((endpoint) => {
    if (!paths[endpoint.path]) {
      paths[endpoint.path] = {}
    }
    // Setup path and append required permissions list to description
    let description = endpoint.operationObject.description || '';
    if (endpoint.permission) {
      description += `\n Requires at least one of the following permissions: [${typeof endpoint.permission === 'string' ? endpoint.permission : endpoint.permission.join(', ')}]`
    }
    (paths[endpoint.path] as OpenAPIV3.PathItemObject)[endpoint.method] = {...endpoint.operationObject, description};
  });
  let schema;
  try {
  // schema.json is generated with the 'build-swagger-docs' npm script. This is what allows us to use Typescript interface declarations in the src/shared/types folder in the swagger docs.
    schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../../schema.json')));
  } catch (err) {
    // No schema file exists, continue on.
  }
  const swaggerDefinition: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
      version: `${process.env.npm_package_version}`,
      title: 'Constellation - Just Enough Governance'
    },
    servers: [
      {
        url: `${process.env.REACT_APP_API_BASE_URL}`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: schema ? JSON.parse(JSON.stringify(schema.definitions).replace(/\#\/definitions/g, '#/components/schemas')) : null
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    paths
  };

  // API documentation endpoint
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

}