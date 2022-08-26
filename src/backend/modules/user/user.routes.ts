import userController from './user.controller';
import { Endpoint } from '../../endpoints';

const endpoints: Endpoint[] = [
  {
    path: '/users/{id}',
    method: 'get',
    handler: userController.getUser,
    operationObject: {
      tags: ['User'],
      summary: 'Get user by ID',
      description: "Get a user by id. Optionally pass 'me' as the id to get the current user.",
      parameters: [{
        name: 'id',
        in: 'path',
        required: true
      }],
      responses: {
        "200": {
          "description": "A single user with their roles and permissions included.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserWithRolesAndPermissions"
              }
            }
          }
        }
      }
    }
  }
];
export default endpoints;