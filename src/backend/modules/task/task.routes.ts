import taskController from './task.controller';
import { Paths } from '../../routes';
import { checkForValidTaskStatusUpdate } from '../../utils/authorization';
import { allAppRoles } from '../../../shared/utils/helpers';

const paths: Paths = {
  '/tasks': {
    get: {
      handler: taskController.searchTasks,
      tags: ['Task'],
      summary: 'Search Tasks',
      description: 'Get a list of tasks by given search parameters',
      parameters: [
        {
          name: 'limit',
          in: 'query',
          description:
            'The number of results to return. Used for pagination. Default: `25`',
        },
        {
          name: 'offset',
          in: 'query',
          description:
            'The number of objects to skip before returning results. Used for pagination. (Usually limit multiplied by page index). Default: `0`',
        },
        {
          name: 'sortBy',
          in: 'query',
          description:
            'The property to sort by (such as `name`). If sorting by a nested object, use like so: `assignee.displayName`. Default: `createdAt`',
        },
        {
          name: 'sortAsc',
          in: 'query',
          description:
            'If true, results will be returned in ascending order. Default: `false`',
        },
        {
          name: 'id',
          in: 'query',
          description:
            'An example of a filter. Any property such as `id`, `name`, and `phase` (including nested properties like `assignee.id`) can be filtered by attaching a query parameter. You can filter by as many properties as needed. Filters will only return exact matches. Multiple values can be filtered by separating with a comma (i.e. `phase=initiate,design`).',
        },
        {
          name: 'search',
          in: 'query',
          description:
            'Searches all properties in an SEP and its included nested objects by a given string. Searches will be applied using a SQL `LIKE %search%` operator, so results do not need to be an exact match.',
        },
      ],
      responses: {
        '200': {
          description:
            'A paginated list of filtered and sorted tasks with a total count.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TaskSearchResult',
              },
            },
          },
        },
      },
    },
  },
  '/task/{id}/status': {
    patch: {
      handler: taskController.updateTaskStatus,
      middleware: [
        (req, res, next, db) => {
          checkForValidTaskStatusUpdate(
            res,
            next,
            db,
            parseInt(req.params.id),
            req.body.status
          );
        },
      ],
      tags: ['Task'],
      summary: 'Update the status of a task',
      description:
        'Updates the status of a task and moves any dependent tasks from "pending" to "todo"',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
        },
      ],
      requestBody: {
        description: 'The status to move the task to',
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateTaskStatusBody',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Success',
        },
      },
    },
  },
  '/sep/{sepID}/tasks': {
    get: {
      handler: taskController.getTasksBySEPID,
      tags: ['Task'],
      summary: 'Get Tasks by SEP ID',
      description: 'Get a list of tasks by given SEP ID',
      parameters: [
        {
          name: 'sepID',
          in: 'path',
          description: 'The SEP ID to get the tasks for',
        },
      ],
      responses: {
        '200': {
          description: 'A list of tasks for a given SEP.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/TaskExtended',
                },
              },
            },
          },
        },
      },
    },
    patch: {
      handler: taskController.updateMultipleTasks,
      role: allAppRoles,
      tags: ['Task'],
      summary: 'Update multiple tasks',
      description: 'Updates multiple tasks',
      parameters: [
        {
          name: 'sepID',
          in: 'path',
          description: 'The SEP ID of the tasks being updated',
        },
      ],
      requestBody: {
        description: 'The attributes of the task to update',
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/UpdateMultipleTaskBody',
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Success',
        },
      },
    },
  },
  '/task/{id}': {
    patch: {
      handler: taskController.updateTask,
      role: allAppRoles,
      tags: ['Task'],
      summary: 'Update a task ',
      description: 'Updates a task',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
        },
      ],
      requestBody: {
        description: 'The attributes of the task to update',
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateTaskBody',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Task',
              },
            },
          },
        },
      },
    },
    delete: {
      handler: taskController.deleteTask,
      role: allAppRoles,
      tags: ['Task'],
      summary: 'Delete a task (soft-delete)',
      description: 'Performs a soft-delete on a task',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
        },
      ],
      responses: {
        '200': {
          description: 'Success',
        },
      },
    },
  },
  '/task': {
    post: {
      handler: taskController.createTask,
      role: allAppRoles,
      tags: ['Task'],
      summary: 'Create a new task',
      description: 'Create a new task',
      requestBody: {
        description: 'The task to create',
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateTaskBody',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Task',
              },
            },
          },
        },
      },
    },
  },
};

export default paths;
