import knockoutController from './knockout.controller';
import { Paths } from '../../routes';

const paths: Paths = {
  '/knockouts/{sepID}': {
    get: {
      handler: knockoutController.getKnockoutScreens,
      tags: ['Knockout'],
      summary: 'Get Knockout Screens by SEP ID',
      description: 'Get a list of ordered knockout screens by SEP id',
      parameters: [
        {
          name: 'sepID',
          in: 'path',
          required: true,
        },
      ],
      responses: {
        '200': {
          description:
            'A list of ordered knockout screens by SEP id. Response will vary based on the data fields in the knockout screens that have been answered.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/KnockoutScreenWithCompletion',
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
