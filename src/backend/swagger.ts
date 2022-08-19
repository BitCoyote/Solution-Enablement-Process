import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
// schema.json is generated with the 'build-swagger-docs' npm script. This is what allows us to use Typescript interface declarations in the src/shared/types folder in the swagger docs.
// @ts-ignore
import schema from '../../schema.json';
import { OpenAPIV3 } from "openapi-types";
import endpoints from './endpoints';

export default (app: express.Application) => {
  // Create Open API documentation for all the endpoints in the application.
  const paths: OpenAPIV3.PathsObject = {};
  endpoints.forEach((endpoint)=>{
    if (!paths[endpoint.path]) {
      paths[endpoint.path] = {}
    }
    (paths[endpoint.path] as OpenAPIV3.PathItemObject)[endpoint.method] = endpoint.operationObject;
  });
  const swaggerDefinition: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
      version: `${process.env.npm_package_version}`,
      title: 'Constellation - Just Enough Governance'
    },
    servers: [
      {
        url: `${process.env.REACT_APP_API_BASE_URL}:${process.env.API_PORT}`
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
      schemas: JSON.parse(JSON.stringify(schema.definitions).replace(/\#\/definitions/g, '#/components/schemas'))
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