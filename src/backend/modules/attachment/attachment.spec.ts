import path from 'path';
import { BackendTestingGlobals } from '../../../../testing/types';
import {
  CreateURLAttachmentBody,
  UpdateURLAttachmentBody,
} from '../../../shared/types/Attachment';
import formidable from 'formidable';

describe('attachment module', () => {
  const globals = globalThis as unknown as BackendTestingGlobals;

  describe('GET /sep/{sepID}/attachments', () => {
    it('should return a list of attachments for a given SEP id', async () => {
      const response = await globals.request
        .get(`/sep/1/attachments`)
        .expect(200);
      expect(response.body.length).toEqual(2);
      expect(response.body[0].id).toEqual(1);
      expect(response.body[0].creator.id).toBe(globals.loggedInUserID);
    });
  });

  describe('GET /attachment/download/{id}', () => {
    it('should download an attachment', (done) => {
      globals.request
        .get(`/attachment/download/1`)
        .expect(200)
        .end(function (err: any, res: any) {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('should return a 404 when the attachment cannot be found', async () => {
      await globals.request.get(`/attachment/download/9526`).expect(404);
    });
  });

  describe('POST /attachment', () => {
    it('should create a url attachment', async () => {
      const response = await globals.request
        .post(`/attachment`)
        .send({
          name: 'floof',
          url: 'https://google.com',
          sepID: 1,
        } as CreateURLAttachmentBody)
        .expect(200);
      expect(response.body.name).toEqual('floof');
      expect(
        (await globals.db.Attachment.findByPk(response.body.id))?.name
      ).toEqual('floof');
    });
  });

  describe('PATCH /attachment/{id}', () => {
    it('should update a url attachment', async () => {
      const response = await globals.request
        .patch(`/attachment/2`)
        .send({
          name: 'taco',
        } as UpdateURLAttachmentBody)
        .expect(200);
      expect(response.body.name).toEqual('taco');
      expect((await globals.db.Attachment.findByPk(2))?.name).toEqual('taco');
    });
    it('should update a url attachments url', async () => {
      const response = await globals.request
        .patch(`/attachment/2`)
        .send({
          url: 'https://wolframalpha.com',
        } as UpdateURLAttachmentBody)
        .expect(200);
      expect(response.body.url).toEqual('https://wolframalpha.com');
      expect((await globals.db.Attachment.findByPk(2))?.url).toEqual(
        'https://wolframalpha.com'
      );
    });
    it('should not update an attachment that has a mimeType', async () => {
      await globals.request
        .patch(`/attachment/1`)
        .send({
          name: 'taco',
        } as UpdateURLAttachmentBody)
        .expect(400);
    });
    it('should return a 404 when the attachment cannot be found', async () => {
      await globals.request
        .patch(`/attachment/3`)
        .send({
          name: 'taco',
        } as UpdateURLAttachmentBody)
        .expect(404);
    });
  });

  describe('DELETE /attachment/{id}', () => {
    it('should delete an attachment', async () => {
      await globals.request.delete(`/attachment/2`).expect(200);
      expect(await globals.db.Attachment.findByPk(2)).toBeNull();
    });
  });

  describe('POST /sep/{sepID}/attachment/upload', () => {
    it('should upload a file attachment', async () => {
      const response = await globals.request
        .post(`/sep/1/attachment/upload`)
        .set('Content-Type', `multipart/form-data`)
        .set({ connection: 'keep-alive' })
        .field('name', 'attachment')
        .attach(
          'file',
          path.join(
            __dirname,
            `../../../../testing/mocks/constellation-logo.png`
          )
        )
        .expect(200);
      expect(response.body.name).toBe('constellation-logo.png');
      expect(
        (await globals.db.Attachment.findByPk(response.body.id))?.name
      ).toEqual('constellation-logo.png');
    });
    it('should upload a file attachment with a task id', async () => {
      const response = await globals.request
        .post(`/sep/1/attachment/upload?taskID=1`)
        .set('Content-Type', `multipart/form-data`)
        .set({ connection: 'keep-alive' })
        .field('name', 'attachment')
        .attach(
          'file',
          path.join(
            __dirname,
            `../../../../testing/mocks/constellation-logo.png`
          )
        )
        .expect(200);
      expect(response.body.name).toBe('constellation-logo.png');
      expect(response.body.taskID).toBe(1);
      expect(
        (await globals.db.Attachment.findByPk(response.body.id))?.name
      ).toEqual('constellation-logo.png');
    });
    it('should return a 400 if the file upload fails', async () => {
      jest.spyOn(formidable, 'formidable').mockReturnValueOnce({
        parse: (req: any, callback: any) => {
          callback(
            'Error! This is intentionally testing error handling in a test and can be ignored.',
            null,
            null
          );
        },
      } as any);
      await globals.request
        .post(`/sep/1/attachment/upload?taskID=1`)
        .set('Content-Type', `multipart/form-data`)
        .set({ connection: 'keep-alive' })
        .field('name', 'attachment')
        .attach(
          'file',
          path.join(
            __dirname,
            `../../../../testing/mocks/constellation-logo.png`
          )
        )
        .expect(400);
      expect(await globals.db.Attachment.count()).toBe(2);
    });
  });

  describe('PATCH /attachment/upload/{id}', () => {
    it('should upload a new version of a file attachment', async () => {
      const response = await globals.request
        .patch(`/attachment/upload/1`)
        .set('Content-Type', `multipart/form-data`)
        .set({ connection: 'keep-alive' })
        .field('name', 'attachment')
        .attach(
          'file',
          path.join(
            __dirname,
            `../../../../testing/mocks/constellation-logo.png`
          )
        )
        .expect(200);
      expect(response.body.name).toBe('constellation-logo.png');
      expect(
        (await globals.db.Attachment.findByPk(response.body.id))?.name
      ).toEqual('constellation-logo.png');
    });
    it('should return a 400 if the file upload fails', async () => {
      jest.spyOn(formidable, 'formidable').mockReturnValueOnce({
        parse: (req: any, callback: any) => {
          callback(
            'Error! This is intentionally testing error handling in a test and can be ignored.',
            null,
            null
          );
        },
      } as any);
      await globals.request
        .patch(`/attachment/upload/1`)
        .set('Content-Type', `multipart/form-data`)
        .set({ connection: 'keep-alive' })
        .field('name', 'attachment')
        .attach(
          'file',
          path.join(
            __dirname,
            `../../../../testing/mocks/constellation-logo.png`
          )
        )
        .expect(400);
      expect((await globals.db.Attachment.findByPk(1))?.name).toEqual(
        'Cool File Attachment'
      );
    });
    it('should return a 404 if the attachment cannot be found', async () => {
      await globals.request
        .patch(`/attachment/upload/3`)
        .set('Content-Type', `multipart/form-data`)
        .set({ connection: 'keep-alive' })
        .field('name', 'attachment')
        .attach(
          'file',
          path.join(
            __dirname,
            `../../../../testing/mocks/constellation-logo.png`
          )
        )
        .expect(404);
    });
  });
});
