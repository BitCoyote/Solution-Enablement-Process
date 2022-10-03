import { BackendTestingGlobals } from '../../../../testing/types';
describe('sep module', () => {
  const globals = globalThis as unknown as BackendTestingGlobals;

  describe('GET /seps', () => {
    it('should return a list of seps', async () => {
      const response = await globals.request.get(`/seps`).expect(200);
      expect(response.body.count).toEqual(3);
      expect(response.body.seps.length).toEqual(3);
    });
    it('should return a list of seps limited by the limit query param', async () => {
      const response = await globals.request.get(`/seps?limit=1`).expect(200);
      expect(response.body.count).toEqual(3);
      expect(response.body.seps.length).toEqual(1);
      expect(response.body.seps[0].id).toEqual(1);
    });
    it('should return a list of seps offset by the offset query param', async () => {
      const response = await globals.request
        .get(`/seps?limit=1&offset=1`)
        .expect(200);
      expect(response.body.count).toEqual(3);
      expect(response.body.seps.length).toEqual(1);
      expect(response.body.seps[0].id).toEqual(2);
    });
    it('should return a list of seps sorted by the "sortBy" param', async () => {
      const response = await globals.request
        .get(`/seps?sortBy=name`)
        .expect(200);
      expect(response.body.count).toEqual(3);
      expect(response.body.seps.length).toEqual(3);
      expect(response.body.seps[0].id).toEqual(3);
    });
    it('should return a list of seps sorted by the "sortAsc" param', async () => {
      const response = await globals.request
        .get(`/seps?sortBy=name&sortAsc=true`)
        .expect(200);
      expect(response.body.count).toEqual(3);
      expect(response.body.seps.length).toEqual(3);
      expect(response.body.seps[0].id).toEqual(1);
    });
    it('should return a list of seps sorted by a nested "sortBy" param', async () => {
      const response = await globals.request
        .get(`/seps?sortBy=creator.displayName`)
        .expect(200);
      expect(response.body.count).toEqual(3);
      expect(response.body.seps.length).toEqual(3);
      expect(response.body.seps[0].id).toEqual(2);
    });
    it('should return a list of seps filtered by a given filter', async () => {
      const response = await globals.request
        .get(`/seps?phase=design`)
        .expect(200);
      expect(response.body.count).toEqual(1);
      expect(response.body.seps.length).toEqual(1);
      expect(response.body.seps[0].id).toEqual(2);
    });
    it('should return a list of seps filtered by a given filter with multiple values', async () => {
      const response = await globals.request
        .get(`/seps?phase=design,initiate`)
        .expect(200);
      expect(response.body.count).toEqual(2);
      expect(response.body.seps.length).toEqual(2);
    });
    it('should return a list of seps filtered by a given nested filter', async () => {
      const response = await globals.request
        .get(`/seps?creator.id=abc`)
        .expect(200);
      expect(response.body.count).toEqual(1);
      expect(response.body.seps.length).toEqual(1);
      expect(response.body.seps[0].id).toEqual(1);
    });
    it('should return a list of seps filtered by a given search query', async () => {
      const response = await globals.request
        .get(`/seps?search=incredible`)
        .expect(200);
      expect(response.body.count).toEqual(1);
      expect(response.body.seps.length).toEqual(1);
      expect(response.body.seps[0].id).toEqual(2);
    });
  });
  describe('POST /sep', () => {
    const newSEP = {
      name: 'My Cool SEP',
    };
    it('should create and return a new SEP', async () => {
      const response = await globals.request
        .post(`/sep`)
        .send(newSEP)
        .expect(200);
      expect(response.body.name).toEqual(newSEP.name);
      expect(await globals.db.SEP.findByPk(response.body.id)).toBeDefined();
    });
    it('should return an error if an invalid body is given', async () => {
      await globals.request.post(`/sep`).send({}).expect(400);
    });
    it('should create associated sep items from templates', async () => {
      const taskCount = await globals.db.Task.count();
      const taskDepCount = await globals.db.TaskDependency.count();
      const knockoutScreenCount = await globals.db.KnockoutScreen.count();
      const dataFieldsCount = await globals.db.DataField.count();
      const dataFieldOptionsCount = await globals.db.DataFieldOption.count();
      const knockoutFollowupCount = await globals.db.KnockoutFollowup.count();
      await globals.request.post(`/sep`).send(newSEP).expect(200);
      expect(await globals.db.Task.count()).toBeGreaterThan(taskCount);
      expect(await globals.db.TaskDependency.count()).toBeGreaterThan(
        taskDepCount
      );
      expect(await globals.db.KnockoutScreen.count()).toBeGreaterThan(
        knockoutScreenCount
      );
      expect(await globals.db.DataField.count()).toBeGreaterThan(
        dataFieldsCount
      );
      expect(await globals.db.DataFieldOption.count()).toBeGreaterThan(
        dataFieldOptionsCount
      );
      expect(await globals.db.KnockoutFollowup.count()).toBeGreaterThan(
        knockoutFollowupCount
      );
    });
  });
  describe('GET /sep/{id}', () => {
    it('should return an error when the sep is not in the database.', async () => {
      await globals.request.get(`/sep/999999999`).expect(404);
    });
    it('should successfully return a sep with extended data', async () => {
      const response = await globals.request.get(`/sep/1`).expect(200);
      expect(response.body.id).toEqual(1);
    });
  });
  describe('GET /sep/{id}/extended', () => {
    it('should return an error when the sep is not in the database.', async () => {
      await globals.request.get(`/sep/999999999/extended`).expect(404);
    });
    it('should successfully return a sep with extended data', async () => {
      const response = await globals.request.get(`/sep/1/extended`).expect(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.creator).toBeDefined();
      expect(response.body.tasks).toBeDefined();
      expect(response.body.comments).toBeDefined();
      expect(response.body.activities).toBeDefined();
      expect(response.body.attachments).toBeDefined();
      expect(response.body.dataFields).toBeDefined();
    });
  });
});
