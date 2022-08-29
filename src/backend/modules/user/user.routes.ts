import userController from './user.controller';
import { Endpoint } from '../../routes';
import { mustOwnResource } from '../../utils/authorization';

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
  },
  {
    path: '/users/{id}',
    method: 'patch',
    handler: userController.updateUser,
    middleware: [
      (req, res, next, db) => { mustOwnResource(req, res, next, db.User, req.params.id as string) }
    ],
    operationObject: {
      tags: ['User'],
      summary: 'Update user by ID',
      description: "Update a user by id.",
      parameters: [{
        name: 'id',
        in: 'path',
        required: true
      }],
      requestBody: {
        description: 'The user fields to update',
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/User"
            }
          }
        }
      },
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