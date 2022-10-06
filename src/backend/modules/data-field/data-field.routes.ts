import dataFieldController from './data-field.controller';
import { Paths } from '../../routes';
import { mustBeRequestorOrResourceOwner } from '../../utils/authorization';

const paths: Paths = {
  '/data-fields/{sepID}': {
    patch: {
      handler: dataFieldController.updateDataFields,
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
      tags: ['Data Field'],
      summary: 'Update a list of data fields by SEP id',
      description: 'Update a list of data fields by SEP id',
      parameters: [
        {
          name: 'sepID',
          in: 'path',
          required: true,
        },
      ],
      requestBody: {
        description: 'The data fields to update',
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/DataFieldUpdate',
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'The updated fields',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/DataFieldWithOptionsAndLocations',
                },
              },
            },
          },
        },
      },
    },
  },
};

export default paths;
