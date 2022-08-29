import { SuperTest, Test } from 'supertest';

describe('routes', () => {
  const globals = globalThis as any;
  it('should throw a 500 error if an uncaught error occurs', async () => {
    // This mocks db.User.findOne with the real implmentation first since it is used in the authentication.ts middleware.
    // The 2nd implementation will throw an error to trigger the error handler in routes.ts
    const mockFn = jest
      .fn(() => globals.db.User.findOne)
      .mockImplementationOnce(() => globals.db.User.findOne)
      .mockImplementationOnce(() => {throw Error});

    globals.db.User.findOne = mockFn;
    await (globals.request as SuperTest<Test>)
      .get(`/users/123`)
      .expect(500);

  });
});
