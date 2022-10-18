import express from 'express';
import Database from '../../models';
import { AttachmentModel } from '../../models/attachment.model';
import { downloadBlob, getUploadStream } from '../../utils/azure-storage';
import formidable from 'formidable';
import { Transaction } from 'sequelize';

const uploadFile = async (
  req: express.Request,
  attachment: AttachmentModel,
  transaction: Transaction
) => {
  const stream = await getUploadStream(attachment.sepID, attachment.id);
  // Stream the file to azure storage so we don't have to wait for the entire file to transfer from the user's browser to the backend.
  const form = formidable.formidable({
    fileWriteStreamHandler: () => stream,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 20MB
  });
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, file) => {
      if (err) {
        // If an error occurs with the upload, reject this promise to make sequelize automatically rollback the transaction.
        return reject(err);
      }
      const fileName = (file.file as formidable.File).toJSON()
        .originalFilename as string;
      const mimeType = (file.file as formidable.File).toJSON()
        .mimetype as string;
      // When the upload stream is complete, we can update the name and mimetype
      await attachment.update({ name: fileName, mimeType }, { transaction });
      resolve(attachment);
    });
  });
};

const attachmentController = {
  getAttachmentsBySepID: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const sepID = parseInt(req.params.sepID);
    const attachments = await db.Attachment.findAll({
      where: {
        sepID,
      },
      include: [
        {
          model: db.User,
          as: 'creator',
          attributes: ['id', 'email', 'displayName'],
        },
      ],
    });
    return res.send(attachments);
  },
  uploadFileAttachment: async (
    req: any,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const { taskID } = req.query;
    const { sepID } = req.params;
    const attachment = await db.sequelize.transaction(async (transaction) => {
      // Create the attachment with a temporary name and mimetype.
      const attachment = await db.Attachment.create(
        {
          createdBy: res.locals.user.oid,
          name: 'temp',
          mimeType: 'temp',
          sepID: parseInt(sepID),
          taskID: taskID ? parseInt(taskID) : null,
        },
        { transaction }
      );
      return uploadFile(req, attachment, transaction);
    });
    return res.send(attachment);
  },
  uploadNewFileAttachmentVersion: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const { id } = req.params;
    const attachment = (await db.Attachment.findByPk(
      parseInt(id)
    )) as AttachmentModel;
    await db.sequelize.transaction(async (transaction) => {
      return uploadFile(req, attachment, transaction);
    });
    return res.send(attachment);
  },
  downloadAttachment: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const { id } = req.params;
    const attachment = (await db.Attachment.findByPk(
      parseInt(id)
    )) as AttachmentModel;
    if (!attachment) {
      return res.status(404).send('Cannot find attachment.');
    }
    const downloadBlockBlobResponse = await downloadBlob(
      attachment.sepID,
      parseInt(id)
    );
    downloadBlockBlobResponse.readableStreamBody?.on('end', () => {
      res.end();
    });
    await downloadBlockBlobResponse.readableStreamBody?.pipe(res);
    return res;
  },
  deleteAttachment: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const { id } = req.params;
    await db.Attachment.destroy({ where: { id: parseInt(id) } });
    return res.send();
  },
  createURLAttachment: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const newAttachment = await db.Attachment.create({
      name: req.body.name,
      url: req.body.url,
      sepID: req.body.sepID,
      taskID: req.body.taskID,
      createdBy: res.locals.user.oid,
    });
    return res.send(newAttachment);
  },
  updateURLAttachment: async (
    req: express.Request,
    res: express.Response,
    db: Database
  ): Promise<express.Response> => {
    const { id } = req.params;
    const attachment = (await db.Attachment.findByPk(
      parseInt(id)
    )) as AttachmentModel;
    if (attachment.mimeType) {
      return res
        .status(400)
        .send('This endpoint can only be used to update URL attachments.');
    }
    await attachment.update({
      name: req.body.name ?? attachment.name,
      url: req.body.url ?? attachment.url,
    });
    return res.send(attachment);
  },
};

export default attachmentController;
