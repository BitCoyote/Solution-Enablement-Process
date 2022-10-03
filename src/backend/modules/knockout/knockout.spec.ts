import { BackendTestingGlobals } from '../../../../testing/types';
describe('knockout module', () => {
  const globals = globalThis as unknown as BackendTestingGlobals;

  describe('GET /knockouts/{sepID}', () => {
    it('should return a list of knockout questions.', async () => {
      // Create a new SEP so the knockout screens and followsup are generated in the database
      const sepResponse = await globals.request
        .post(`/sep`)
        .send({ name: 'Cool SEP' });
      const response = await globals.request
        .get(`/knockouts/${sepResponse.body.id}`)
        .expect(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
