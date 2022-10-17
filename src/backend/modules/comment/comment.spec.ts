import { BackendTestingGlobals } from '../../../../testing/types';
import {
  CreateCommentBody,
  UpdateCommentBody,
} from '../../../shared/types/Comment';
describe('comment module', () => {
  const globals = globalThis as unknown as BackendTestingGlobals;
  describe('GET /sep/{sepID}/comments', () => {
    it('should return a list of comments for a given SEP id', async () => {
      const response = await globals.request.get(`/sep/1/comments`).expect(200);
      expect(response.body.length).toEqual(2);
      expect(response.body[0].id).toEqual(1);
      expect(response.body[1].replyComment.id).toEqual(1);
    });
  });
  describe('PATCH /comment/{id}', () => {
    it('should successfully update a comment', async () => {
      const updateText = 'chicken noodle soup';
      const response = await globals.request
        .patch(`/comment/2`)
        .send({ comment: updateText } as UpdateCommentBody)
        .expect(200);
      const comment = await globals.db.Comment.findByPk(2);
      expect(comment?.comment).toEqual(updateText);
      expect(response.body.comment).toEqual(updateText);
    });
  });
  describe('POST /comment', () => {
    it('should create a new comment', async () => {
      const newComment: CreateCommentBody = {
        sepID: 1,
        comment: 'blorg',
      };
      const response = await globals.request
        .post(`/comment`)
        .send(newComment)
        .expect(200);
      expect(response.body.createdBy).toEqual(globals.loggedInUserID);
    });
  });
  describe('DELETE /comment/{id}', () => {
    it('should delete a comment', async () => {
      await globals.request.delete(`/comment/2`).expect(200);
      const comment = await globals.db.Comment.findByPk(2);
      expect(comment).toBeNull();
    });
  });
});
