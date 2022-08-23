import {SuperTest, Test} from 'supertest';

describe('User module', () => {
  const globals = globalThis as any;
  describe('GET /users/{id}', () => {
    it('should return an error when the user is not in the database.', async () => {
      globals.db.User.findOne = jest.fn().mockReturnValue(null);
      await (globals.request as SuperTest<Test>)
        .get(`/users/blorg`)
        .expect(404);
    });
    it('should return an error if SQL throws an error', async () => {
      globals.db.User.findOne = jest.fn(() => {
        throw Error();
      });
      await (globals.request as SuperTest<Test>)
        .get(`/users/blorg`)
        .set('Blorp', 'forlop')
        .set('Authorization', `Bearer ${globals.tokens.idToken}`)
        .expect(500)
    });
    it('should successfully return the requesting user when "me" is passed as the id parameter', async () => {
      const user = { id: 'blorg' };
      const mockFindOne = jest.fn();
      mockFindOne.mockReturnValue(user);
      globals.db.User.findOne = mockFindOne;
      await (globals.request as SuperTest<Test>)
        .get(`/users/me`)
        .expect(user)
        .expect(200)
      expect(mockFindOne.mock.calls[0][0].where.id).toEqual(globals.tokens.idTokenClaims.oid);
    });
    it('should successfully return a user ', async () => {
      const user = { id: 'blorg' };
      const mockFindOne = jest.fn();
      mockFindOne.mockReturnValue(user);
      globals.db.User.findOne = mockFindOne;
      await (globals.request as SuperTest<Test>)
        .get(`/users/${user.id}`)
        .expect(user)
        .expect(200)
      expect(mockFindOne.mock.calls[0][0].where.id).toEqual(user.id);
    });

  });
});
