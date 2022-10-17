import { BackendTestingGlobals } from '../../../../testing/types';
import {
  CreateTaskBody,
  TaskPhase,
  TaskStatus,
  UpdateTaskBody,
  UpdateTaskStatusBody,
} from '../../../shared/types/Task';
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
      expect(assigneeResponse.body.tasks[0].id).toEqual(4);
      const reviewerResponse = await globals.request
        .get(`/tasks?sortBy=defaultReviewer.displayName`)
        .expect(200);
      expect(reviewerResponse.body.count).toEqual(5);
      expect(reviewerResponse.body.tasks.length).toEqual(5);
      expect(reviewerResponse.body.tasks[0].id).toEqual(5);
    });
    it('should return a list of tasks filtered by a given filter', async () => {
      const response = await globals.request
        .get(`/tasks?phase=design`)
        .expect(200);
      expect(response.body.count).toEqual(2);
      expect(response.body.tasks.length).toEqual(2);
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
    it('should assign the task to the defaultReviewer when status is set to "inReview"', async () => {
      await globals.request
        .patch(`/task/5/status`)
        .send({ status: 'inReview' } as UpdateTaskStatusBody)
        .expect(200);
      const task = await globals.db.Task.findByPk(5);
      expect(task?.assignedUserID).toEqual('abc');
    });
    it('should assign the task to the sep creator when status is set to "todo"', async () => {
      await globals.request
        .patch(`/task/5/status`)
        .send({ status: 'todo' } as UpdateTaskStatusBody)
        .expect(200);
      const task = await globals.db.Task.findByPk(5);
      expect(task?.assignedUserID).toEqual('system');
    });
    it('should assign the task to the sep creator when status is set to "changesRequested"', async () => {
      await globals.request
        .patch(`/task/5/status`)
        .send({ status: 'changesRequested' } as UpdateTaskStatusBody)
        .expect(200);
      const task = await globals.db.Task.findByPk(5);
      expect(task?.assignedUserID).toEqual('system');
    });
    it('should lock tasks in the same phase if all tasks in the same phase are complete', async () => {
      await globals.db.SEP.update({ phase: 'initiate' }, { where: { id: 3 } });
      await globals.request
        .patch(`/task/4/status`)
        .send({ status: 'complete' } as UpdateTaskStatusBody)
        .expect(200);
      await globals.request
        .patch(`/task/5/status`)
        .send({ status: 'complete' } as UpdateTaskBody)
        .expect(200);
      const unlockedTaskCount = await globals.db.Task.count({
        where: { phase: 'initiate', sepID: 3, locked: false },
      });
      expect(unlockedTaskCount).toEqual(0);
    });
    it('should update the SEP phase when all enabled tasks in a single phase are complete', async () => {
      await globals.request
        .patch(`/task/4/status`)
        .send({ status: 'complete' } as UpdateTaskStatusBody)
        .expect(200);
      await globals.request
        .patch(`/task/5/status`)
        .send({ status: 'complete' } as UpdateTaskBody)
        .expect(200);
      const sep = await globals.db.Task.findByPk(3);
      expect(sep?.phase).toEqual('design');
    });
  });
  describe('GET /sep/{sepID}/tasks', () => {
    it('should return a list of tasks for a given SEP id', async () => {
      const response = await globals.request.get(`/sep/1/tasks`).expect(200);
      expect(response.body.length).toEqual(1);
      expect(response.body[0].id).toEqual(1);
      expect(response.body[0].parentTasks).toBeDefined();
    });
  });
  describe('PATCH /sep/{sepID}/tasks', () => {
    it('should successfully update a list of tasks', async () => {
      await globals.request
        .patch(`/sep/1/tasks`)
        .send([{ id: 1, description: 'Howdy!' }])
        .expect(200);
      expect((await globals.db.Task.findByPk(1))?.description).toEqual(
        'Howdy!'
      );
    });
  });
  describe('PATCH /task/{id}', () => {
    it('should successfully update a task', async () => {
      const response = await globals.request
        .patch(`/task/5`)
        .send({ description: 'Cool!' } as UpdateTaskBody)
        .expect(200);
      const task = await globals.db.Task.findByPk(5);
      expect(task?.description).toEqual('Cool!');
      expect(response.body.description).toEqual('Cool!');
    });
    it('should update dependent tasks to the "todo" status when a parent task is disabled', async () => {
      await globals.request
        .patch(`/task/5`)
        .send({ enabled: false } as UpdateTaskBody)
        .expect(200);
      const task = await globals.db.Task.findByPk(4);
      expect(task?.status).toEqual(TaskStatus.todo);
    });
    it('should lock tasks in the same phase if all tasks in the same phase are complete', async () => {
      await globals.db.SEP.update({ phase: 'initiate' }, { where: { id: 3 } });
      await globals.request
        .patch(`/task/4`)
        .send({ enabled: false } as UpdateTaskBody)
        .expect(200);
      await globals.request
        .patch(`/task/5`)
        .send({ enabled: false } as UpdateTaskBody)
        .expect(200);
      const unlockedTaskCount = await globals.db.Task.count({
        where: { phase: 'initiate', sepID: 3, locked: false },
      });
      expect(unlockedTaskCount).toEqual(0);
    });
    it('should update the SEP phase when all enabled tasks in a single phase are complete', async () => {
      await globals.db.SEP.update({ phase: 'initiate' }, { where: { id: 3 } });

      await globals.request
        .patch(`/task/4`)
        .send({ enabled: false } as UpdateTaskBody)
        .expect(200);
      await globals.request
        .patch(`/task/5`)
        .send({ enabled: false } as UpdateTaskBody)
        .expect(200);
      const sep = await globals.db.SEP.findByPk(3);
      expect(sep?.phase).toEqual('design');
    });
  });
  describe('POST /task', () => {
    it('should create a new task', async () => {
      const newTask: CreateTaskBody = {
        sepID: 1,
        shortName: 'ok',
        name: 'blorg',
        phase: TaskPhase.initiate,
      };
      const response = await globals.request
        .post(`/task`)
        .send(newTask)
        .expect(200);
      expect(response.body.status).toEqual(TaskStatus.todo);
      expect(response.body.createdBy).toEqual(globals.loggedInUserID);
    });
    it('should assign the task to the assigned user when given in the request body', async () => {
      const newTask: CreateTaskBody = {
        sepID: 1,
        name: 'blorg',
        shortName: 'ok',
        phase: TaskPhase.initiate,
        assignedUserID: 'system',
      };
      const response = await globals.request
        .post(`/task`)
        .send(newTask)
        .expect(200);
      expect(response.body.assignedUserID).toEqual('system');
    });
    it('should assign the task to the sep creator when no assignedUserID is given', async () => {
      const newTask: CreateTaskBody = {
        sepID: 1,
        name: 'blorg',
        shortName: 'ok',
        phase: TaskPhase.initiate,
      };
      const response = await globals.request
        .post(`/task`)
        .send(newTask)
        .expect(200);
      expect(response.body.assignedUserID).toEqual('abc');
    });
  });
  describe('DELETE /task/{id}', () => {
    it('should delete a task', async () => {
      await globals.request.delete(`/task/5`).expect(200);
      const task = await globals.db.Task.findByPk(5);
      expect(task).toBeNull();
    });
    it('should update the SEP phase if deleting the last incomplete task for a phase', async () => {
      await globals.db.SEP.update({ phase: 'initiate' }, { where: { id: 3 } });
      await globals.request.delete(`/task/4`).expect(200);
      await globals.request.delete(`/task/5`).expect(200);
      const sep = await globals.db.SEP.findByPk(3);
      expect(sep?.phase).toEqual('design');
    });
    it('should lock tasks in the same phase if all tasks in the same phase are complete', async () => {
      await globals.db.SEP.update({ phase: 'initiate' }, { where: { id: 3 } });
      await globals.request
        .patch(`/task/5/status`)
        .send({ status: TaskStatus.complete })
        .expect(200);
      await globals.request.delete(`/task/4`).expect(200);
      const task = await globals.db.Task.findByPk(5);
      expect(task?.locked).toEqual(true);
    });
  });
});
