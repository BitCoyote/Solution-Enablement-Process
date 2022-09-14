import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { OpenAPIV3 } from 'openapi-types';
import { paths } from './routes';
const fs = require('fs');
const path = require('path');
const swagger = (app: express.Application) => {
  // Create Open API documentation for all the endpoints in the application.
  // const paths: OpenAPIV3.PathsObject = {};
  const swaggerPaths = JSON.parse(JSON.stringify(paths));
  for (const path in swaggerPaths) {
    for (const method in swaggerPaths[path]) {
      const operationObject = (swaggerPaths[path] as OpenAPIV3.PathItemObject)[
        method as OpenAPIV3.HttpMethods
      ] as any;
      let description = operationObject.description;
      if (operationObject.role) {
        // Append required role list to description
        description += `\n Requires at least one of the following roles: ${operationObject.role}`;
      }
      operationObject.description = description;
      delete operationObject.handler;
      delete operationObject.middleware;
      delete operationObject.role;
      (swaggerPaths[path] as OpenAPIV3.PathItemObject)[
        method as OpenAPIV3.HttpMethods
      ] = operationObject;
    }
  }
  let schema = { definitions: '' };
  try {
    // schema.json is generated with the 'build-swagger-docs' npm script. This is what allows us to use Typescript interface declarations in the src/shared/types folder in the swagger docs.
    schema = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../schema.json'))
    );
  } catch (err) {
    // No schema file exists, continue on.
  }
  const swaggerDefinition: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
      version: `${process.env.npm_package_version}`,
      title: 'Constellation - Just Enough Governance',
    },
    servers: [
      {
        url: `${process.env.REACT_APP_API_BASE_URL}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: JSON.parse(
        JSON.stringify(schema.definitions).replace(
          /#\/definitions/g,
          '#/components/schemas'
        )
      ),
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: swaggerPaths,
  };

  // API documentation endpoint
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));
};
export default swagger;
