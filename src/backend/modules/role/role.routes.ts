import roleController from './role.controller';
import { Paths } from '../../routes';

const paths: Paths = {
  '/roles': {
    "post": {
      handler: roleController.createRole,
      permission: ['MANAGE_ROLES'],
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
};

export default paths;