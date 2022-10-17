import commentController from './comment.controller';
import { Paths } from '../../routes';
import { mustOwnResource } from '../../utils/authorization';

const paths: Paths = {
  '/sep/{sepID}/comments': {
    get: {
      handler: commentController.getCommentsBySepID,
      tags: ['Comment'],
      summary: 'Get comments by SEP id',
      description: 'Get comments by SEP id',
      parameters: [
        {
          name: 'sepID',
          in: 'path',
          required: true,
        },
      ],
      responses: {
        '200': {
          description: 'A list of comments for the given SEP id',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/CommentExtended',
                },
              },
            },
          },
        },
      },
    },
  },
  '/comment': {
    post: {
      handler: commentController.createComment,
      tags: ['Comment'],
      summary: 'Create a new comment',
      description: 'Create a new comment',
      requestBody: {
        description: 'The comment to create',
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateCommentBody',
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
                $ref: '#/components/schemas/Comment',
              },
            },
          },
        },
      },
    },
  },
  '/comment/{id}': {
    patch: {
      handler: commentController.updateComment,
      middleware: [
        (req, res, next, db) => {
          mustOwnResource(req, res, next, db.Comment, parseInt(req.params.id));
        },
      ],
      tags: ['Comment'],
      summary: 'Update a comment',
      description: 'Updates a comment',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
        },
      ],
      requestBody: {
        description: 'The attributes of the comment to update',
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateCommentBody',
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
                $ref: '#/components/schemas/Comment',
              },
            },
          },
        },
      },
    },
    delete: {
      handler: commentController.deleteComment,
      middleware: [
        (req, res, next, db) => {
          mustOwnResource(req, res, next, db.Comment, parseInt(req.params.id));
        },
      ],
      tags: ['Comment'],
      summary: 'Delete a comment (soft-delete)',
      description: 'Performs a soft-delete on a comment',
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
};

export default paths;
