import taskController from './task.controller';
import { Paths } from '../../routes';

const paths: Paths = {
  '/tasks': {
    get: {
      handler: taskController.getTasks,
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
};

export default paths;
