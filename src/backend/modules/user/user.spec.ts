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
});
