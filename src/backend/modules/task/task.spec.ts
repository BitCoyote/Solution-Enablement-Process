import { BackendTestingGlobals } from '../../../../testing/types';
import { TaskStatus, UpdateTaskStatusBody } from '../../../shared/types/Task';
describe('task module', () => {
  const globals = globalThis as unknown as BackendTestingGlobals;

  describe('GET /tasks', () => {
    it('should return a list of tasks', async () => {
      const response = await globals.request.get(`/tasks`).expect(200);
      expect(response.body.count).toEqual(5);
      expect(response.body.tasks.length).toEqual(5);
    });
    it('should return a list of tasks limited by the limit query param', async () => {
      const response = await globals.request.get(`/tasks?limit=1`).expect(200);
      expect(response.body.count).toEqual(5);
      expect(response.body.tasks.length).toEqual(1);
      expect(response.body.tasks[0].id).toEqual(1);
    });
    it('should return a list of tasks offset by the offset query param', async () => {
      const response = await globals.request
        .get(`/tasks?limit=1&offset=1`)
        .expect(200);
      expect(response.body.count).toEqual(5);
      expect(response.body.tasks.length).toEqual(1);
      expect(response.body.tasks[0].id).toEqual(2);
    });
    it('should return a list of tasks sorted by the "sortBy" param', async () => {
      const response = await globals.request
        .get(`/tasks?sortBy=name`)
        .expect(200);
      expect(response.body.count).toEqual(5);
      expect(response.body.tasks.length).toEqual(5);
      expect(response.body.tasks[0].id).toEqual(2);
    });
    it('should return a list of tasks sorted by the dependentTaskCount', async () => {
      const response = await globals.request
        .get(`/tasks?sortBy=dependentTaskCount`)
        .expect(200);
      expect(response.body.count).toEqual(5);
      expect(response.body.tasks.length).toEqual(5);
      expect(response.body.tasks[0].id).toEqual(5);
    });
    it('should return a list of tasks sorted by the "sortAsc" param', async () => {
      const response = await globals.request
        .get(`/tasks?sortBy=name&sortAsc=true`)
        .expect(200);
      expect(response.body.count).toEqual(5);
      expect(response.body.tasks.length).toEqual(5);
      expect(response.body.tasks[0].id).toEqual(5);
    });
    it('should return a list of tasks sorted by a nested "sortBy" param', async () => {
      const sepResponse = await globals.request
        .get(`/tasks?sortBy=sep.name`)
        .expect(200);
      expect(sepResponse.body.count).toEqual(5);
      expect(sepResponse.body.tasks.length).toEqual(5);
      expect(sepResponse.body.tasks[0].id).toEqual(3);
      const assigneeResponse = await globals.request
        .get(`/tasks?sortBy=assignee.displayName`)
        .expect(200);
      expect(assigneeResponse.body.count).toEqual(5);
      expect(assigneeResponse.body.tasks.length).toEqual(5);
      expect(assigneeResponse.body.tasks[0].id).toEqual(1);
      const reviewerResponse = await globals.request
        .get(`/tasks?sortBy=defaultReviewer.displayName`)
        .expect(200);
      expect(reviewerResponse.body.count).toEqual(5);
      expect(reviewerResponse.body.tasks.length).toEqual(5);
      expect(reviewerResponse.body.tasks[0].id).toEqual(1);
    });
    it('should return a list of tasks filtered by a given filter', async () => {
      const response = await globals.request
        .get(`/tasks?phase=design`)
        .expect(200);
      expect(response.body.count).toEqual(4);
      expect(response.body.tasks.length).toEqual(4);
      expect(response.body.tasks[0].id).toEqual(2);
    });
    it('should return a list of tasks filtered by a given filter with multiple values', async () => {
      const response = await globals.request
        .get(`/tasks?phase=design,initiate`)
        .expect(200);
      expect(response.body.count).toEqual(5);
      expect(response.body.tasks.length).toEqual(5);
    });
    it('should return a list of tasks filtered by a given nested filter', async () => {
      const response = await globals.request.get(`/tasks?sep.id=1`).expect(200);
      expect(response.body.count).toEqual(1);
      expect(response.body.tasks.length).toEqual(1);
      expect(response.body.tasks[0].id).toEqual(1);
    });
    it('should return a list of tasks filtered by a given search query', async () => {
      const response = await globals.request
        .get(`/tasks?search=super`)
        .expect(200);
      expect(response.body.count).toEqual(1);
      expect(response.body.tasks.length).toEqual(1);
      expect(response.body.tasks[0].id).toEqual(2);
    });
  });
  describe('PATCH /task/{id}/status', () => {
    it('should successfully update the task status for a valid task status update', async () => {
      await globals.request
        .patch(`/task/5/status`)
        .send({ status: 'complete' } as UpdateTaskStatusBody)
        .expect(200);

      const task = await globals.db.Task.findByPk(5);
      expect(task?.status).toEqual(TaskStatus.complete);
    });
    it('should successfully update dependent task statuses from "pending" to "todo"', async () => {
      await globals.request
        .patch(`/task/5/status`)
        .send({ status: 'complete' } as UpdateTaskStatusBody)
        .expect(200);
      // Task 4 depends on task 5 being complete
      const task = await globals.db.Task.findByPk(4);
      expect(task?.status).toEqual(TaskStatus.todo);
    });
    it('should return a 404 error when the task cannot be found', async () => {
      await globals.request
        .patch(`/task/99935235/status`)
        .send({ status: 'complete' } as UpdateTaskStatusBody)
        .expect(404);
    });
    it('should return a 400 error when the trying to update a task to an invalid status', async () => {
      await globals.request
        .patch(`/task/5/status`)
        .send({ status: 'fake-status' })
        .expect(400);
    });
  });
});
