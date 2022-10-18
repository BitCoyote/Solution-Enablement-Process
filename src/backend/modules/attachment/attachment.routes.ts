import attachmentController from './attachment.controller';
import { Paths } from '../../routes';
import {
  mustBeRequestorOrResourceOwner,
  mustOwnResource,
} from '../../utils/authorization';

const paths: Paths = {
  '/attachment': {
    post: {
      handler: attachmentController.createURLAttachment,
      tags: ['Attachment'],
      summary: 'Create a new URL attachment',
      description: 'Create a new URL attachment',
      middleware: [
        (req, res, next, db) => {
          mustBeRequestorOrResourceOwner(
            res,
            next,
            db,
            parseInt(req.body.sepID)
          );
        },
      ],
      requestBody: {
        description:
          'Create a new URL attachment. Not used for file attachments.',
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateURLAttachmentBody',
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
                $ref: '#/components/schemas/Attachment',
              },
            },
          },
        },
      },
    },
  },
  '/attachment/{id}': {
    patch: {
      handler: attachmentController.updateURLAttachment,
      tags: ['Attachment'],
      summary: 'Update a new URL attachment',
      description: 'Update a new URL attachment',
      middleware: [
        (req, res, next, db) => {
          mustOwnResource(
            req,
            res,
            next,
            db.Attachment,
            parseInt(req.params.id)
          );
        },
      ],
      requestBody: {
        description: 'Updates a URL attachment. Not used for file attachments.',
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateURLAttachmentBody',
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
                $ref: '#/components/schemas/Attachment',
              },
            },
          },
        },
      },
    },
    delete: {
      handler: attachmentController.deleteAttachment,
      middleware: [
        (req, res, next, db) => {
          mustOwnResource(
            req,
            res,
            next,
            db.Attachment,
            parseInt(req.params.id)
          );
        },
      ],
      tags: ['Attachment'],
      summary: 'Delete a attachment (soft-delete)',
      description: 'Performs a soft-delete on a attachment',
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
  '/sep/{sepID}/attachments': {
    get: {
      handler: attachmentController.getAttachmentsBySepID,
      tags: ['Attachment'],
      summary: 'Get attachments by SEP id',
      description: 'Get attachments by SEP id',
      parameters: [
        {
          name: 'sepID',
          in: 'path',
          required: true,
        },
      ],
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
      responses: {
        '200': {
          description: 'A list of attachments for the given SEP id',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/AttachmentExtended',
                },
              },
            },
          },
        },
      },
    },
  },
  '/sep/{sepID}/attachment/upload': {
    post: {
      handler: attachmentController.uploadFileAttachment,
      tags: ['Attachment'],
      parameters: [
        {
          name: 'sepID',
          in: 'path',
          required: true,
        },
        {
          name: 'taskID',
          in: 'query',
          required: false,
        },
      ],
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
      summary: 'Upload a new attachment',
      description: 'Upload a new attachment',
      requestBody: {
        description:
          'Upload a new version of an existing attachment. Don`t forget the enctype="multipart/form-data" in your form. The "name" property on the file input must be "attachment".',
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
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
                $ref: '#/components/schemas/Attachment',
              },
            },
          },
        },
      },
    },
  },
  '/attachment/upload/{id}': {
    patch: {
      handler: attachmentController.uploadNewFileAttachmentVersion,
      tags: ['Attachment'],
      middleware: [
        (req, res, next, db) => {
          mustOwnResource(
            req,
            res,
            next,
            db.Attachment,
            parseInt(req.params.id)
          );
        },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
        },
      ],
      summary: 'Upload a new version of an existing attachment.',
      description:
        'Upload a new version of an existing attachment. Don`t forget the enctype="multipart/form-data" in your form. The "name" property on the file input must be "attachment".',
      requestBody: {
        description: 'The multipart form data of the file to be uploaded',
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
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
                $ref: '#/components/schemas/Attachment',
              },
            },
          },
        },
      },
    },
  },
  '/attachment/download/{id}': {
    get: {
      handler: attachmentController.downloadAttachment,
      tags: ['Attachment'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
        },
      ],
      summary: 'Download an attachment.',
      description: 'Downloads an attachment',
      responses: {
        '200': {
          description: 'Success',
        },
      },
    },
  },
};

export default paths;
