import { SuperTest, Test } from 'supertest';
describe('User module', () => {
  const globals = globalThis as any;

  describe('GET /users/{id}', () => {
    it('should return an error when the user is not in the database.', async () => {
      await (globals.request as SuperTest<Test>)
        .get(`/users/notarealuserid`)
        .expect(404);
    });
    it('should successfully return the requesting user when "me" is passed as the id parameter', async () => {
      const response = await (globals.request as SuperTest<Test>)
        .get(`/users/me`)
        .expect(200)
      expect(response.body.id).toEqual(globals.loggedInUserID);
    });
    it('should successfully return a user ', async () => {
      const response = await (globals.request as SuperTest<Test>)
        .get(`/users/abc`)
        .expect(200);
      expect(response.body.id).toEqual('abc');
    });
  });

  describe('PATCH /users/{id}', () => {
    it('should return an error when the user is not in the database.', async () => {
      await (globals.request as SuperTest<Test>)
        .patch(`/users/notarealuserid`)
        .send({ surname: 'Falafel' })
        .expect(404);
    });
    it('should return an error when trying to update a user that is not the requesting user', async () => {
      await (globals.request as SuperTest<Test>)
        .patch(`/users/abc`)
        .send({ surname: 'Falafel' })
        .expect(403);
    });
    it('should successfully update and return the updated user ', async () => {
      const response = await (globals.request as SuperTest<Test>)
        .patch(`/users/${globals.loggedInUserID}`)
        .send({ surname: 'Falafel' })
        .expect(200);
      expect(response.body.surname).toEqual('Falafel');
      expect((await globals.db.User.findByPk(globals.loggedInUserID)).surname).toEqual('Falafel')
    });
  });

});
