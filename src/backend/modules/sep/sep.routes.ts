import sepController from './sep.controller';
import { Paths } from '../../routes';
import { mustBeRequestorOrResourceOwner } from '../../utils/authorization';

const paths: Paths = {
  '/seps': {
    get: {
      handler: sepController.getSEPs,
      tags: ['SEP'],
      summary: 'Search SEPs',
      description: 'Get a list of SEPs by given search parameters',
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
            'The property to sort by (such as `name`). If sorting by a nested object, use like so: `creator.displayName`. Default: `createdAt`',
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
            'An example of a filter. Any SEP property such as `id`, `name`, and `phase` (including nested properties like `creator.id`) can be filtered by attaching a query parameter. You can filter by as many properties as needed. Filters will only return exact matches. Multiple values can be filtered by separating with a comma (i.e. `phase=initiate,design`).',
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
            'A paginated list of filtered and sorted SEPs with a total count.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SEPSearchResult',
              },
            },
          },
        },
      },
    },
  },
  '/sep': {
    post: {
      handler: sepController.createSEP,
      tags: ['SEP'],
      summary: 'Create SEP',
      description:
        'Create a new SEP. This also creates copies all of the template data (KnockoutScreens, Tasks, etc) to be associated with the new SEP.',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateSEPBody',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Returns the newly created SEP',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SEP',
              },
            },
          },
        },
      },
    },
  },
  '/sep/{id}/extended': {
    get: {
      handler: sepController.getSEPExtended,
      tags: ['SEP'],
      summary: 'Get an extended SEP by ID ',
      description:
        'Get a SEP and all SEP related data for the given SEP (tasks, comments, attachments, etc.) by SEP id.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
        },
      ],
      responses: {
        '200': {
          description:
            'Returns all SEP related data for the given SEP (tasks, comments, attachments, etc.)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GetSEPExtendedResponse',
              },
            },
          },
        },
      },
    },
  },
  '/sep/{id}': {
    get: {
      handler: sepController.getSEP,
      tags: ['SEP'],
      summary: 'Get a SEP by ID ',
      description: 'Get a SEP by id.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
        },
      ],
      responses: {
        '200': {
          description: 'Returns an SEP with its creator info',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GetSEPResponse',
              },
            },
          },
        },
      },
    },
    patch: {
      handler: sepController.updateSEP,
      middleware: [
        (req, res, next, db) => {
          mustBeRequestorOrResourceOwner(
            res,
            next,
            db,
            parseInt(req.params.sepID)
          );
        },
      ],
      tags: ['SEP'],
      summary: 'Update an SEP',
      description: 'Update an SEP',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'The id of the SEP to be updated',
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateSEPBody',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Returns the updated SEP',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SEP',
              },
            },
          },
        },
      },
    },
  },
};

export default paths;
