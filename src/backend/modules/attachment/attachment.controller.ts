import express from 'express';
import Database from '../../models';
import { AttachmentModel } from '../../models/attachment.model';
import { downloadBlob, getUploadStream } from '../../utils/azure-storage';
import formidable from 'formidable';

const attachmentController = {
    getAttachmentsBySepID: async (
        req: express.Request,
        res: express.Response,
        db: Database
    ): Promise<express.Response> => {
        const sepID = parseInt(req.params.sepID);
        const attachments = await db.Attachment.findAll({
            where: {
                sepID
            }, include: [
                {
                    model: db.User,
                    as: 'creator',
                    attributes: ['id', 'email', 'displayName']
                }
            ]
        })
        return res.send(attachments);
    },
    uploadFileAttachment: async (
        req: any,
        res: express.Response,
        db: Database
    ): Promise<express.Response> => {
        const { taskID } = req.query;
        const { sepID } = req.params;
        const attachment = await db.sequelize.transaction(async transaction => {
            // Create the attachment with a temporary name and mimetype.
            const attachment = await db.Attachment.create({
                createdBy: res.locals.user.oid,
                name: 'temp',
                mimeType: 'temp',
                sepID,
                taskID
            }, { transaction });
            const stream = await getUploadStream(sepID, attachment.id);
            // Stream the file to azure storage so we don't have to wait for the entire file to transfer from the user's browser to the backend.
            const form = formidable({
                fileWriteStreamHandler: () => stream,
                maxFileSize: 20 * 1024 * 1024 // 20MB
            });
            return new Promise((resolve, reject) => {
                form.parse(req, async (err, fields, file) => {
                    if (err) {
                        // If an error occurs with the upload, reject this promise to make sequelize automatically rollback the transaction.
                        reject(err);
                    }
                    const fileName = (file.file as formidable.File).toJSON().originalFilename as string;
                    const mimeType = (file.file as formidable.File).toJSON().mimetype as string;
                    // When the upload stream is complete, we can update the name and mimetype
                    await attachment.update({ name: fileName, mimeType }, { transaction });
                    resolve(attachment);
                });
            });
        });
        return res.send(attachment);
    },
    uploadNewFileAttachmentVersion: async (
        req: express.Request,
        res: express.Response,
        db: Database
    ): Promise<express.Response> => {
        const { id } = req.params;
        const attachment = (await db.Attachment.findByPk(parseInt(id))) as AttachmentModel;
        if (!attachment) {
            res.status(404).send('Cannot find attachment.')
        }
        await db.sequelize.transaction(async transaction => {
            const stream = await getUploadStream(attachment.sepID, attachment.id);
            // Stream the file to azure storage so we don't have to wait for the entire file to transfer from the user's browser to the backend.
            const form = formidable({
                fileWriteStreamHandler: () => stream,
                maxFileSize: 20 * 1024 * 1024 // 20MB
            });
            return new Promise((resolve, reject) => {
                form.parse(req, async (err, fields, file) => {
                    if (err) {
                        // If an error occurs with the upload, reject this promise to make sequelize automatically rollback the transaction.
                        reject(err);
                    }
                    const fileName = (file.file as formidable.File).toJSON().originalFilename as string;
                    const mimeType = (file.file as formidable.File).toJSON().mimetype as string;
                    // When the upload stream is complete, we can update the name and mimetype
                    await attachment.update({ name: fileName, mimeType }, { transaction });
                    resolve(attachment);
                });
            });
        });
        return res.send(attachment);
    },
    downloadAttachment: async (
        req: express.Request,
        res: express.Response,
        db: Database
    ): Promise<express.Response> => {
        const { id } = req.params;
        const attachment = (await db.Attachment.findByPk(parseInt(id))) as AttachmentModel;
        if (!attachment) {
            res.status(404).send('Cannot find attachment.')
        }
        const downloadBlockBlobResponse = await downloadBlob(attachment.sepID, parseInt(id));
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
        await db.Attachment.create({ 
            name: req.body.name,
            url: req.body.url,
            sepID: req.body.sepID,
            taskID: req.body.taskID,
            createdBy: res.locals.user.oid
         });
        return res.send();
    },
    updateURLAttachment: async (
        req: express.Request,
        res: express.Response,
        db: Database
    ): Promise<express.Response> => {
        const { id } = req.params;
        const attachment = (await db.Attachment.findByPk(parseInt(id))) as AttachmentModel;
        if (!attachment) {
            res.status(404).send('Cannot find attachment.')
        }
        if (attachment.mimeType || !attachment.url) {
            res.status(400).send('This endpoint can only be used to update URL attachments.')
        }
        await attachment.update({
            name: req.body.name ?? attachment.name,
            url: req.body.url ?? attachment.url
        })
        return res.send();
    },


};

export default attachmentController;
