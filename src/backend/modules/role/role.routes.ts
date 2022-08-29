import roleController from './role.controller';
import { Endpoint } from '../../routes';

const endpoints: Endpoint[] = [
  {
    path: '/roles',
    method: 'post',
    handler: roleController.createRole,
    permission: ['MANAGE_ROLES'],
    operationObject: {
      tags: ['Role'],
      summary: 'Create a role',
      description: "Create a role.",
      requestBody: {
        description: 'The role to create',
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/NewRole"
            }
          }
        }
      },
      responses: {
        "200": {
          "description": "The role that has been created",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Role"
              }
            }
          }
        }
      }
    }
  }

];
export default endpoints;