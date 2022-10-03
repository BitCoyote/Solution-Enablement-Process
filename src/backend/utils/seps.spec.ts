import { BackendTestingGlobals } from '../../../testing/types';
import { SEP, SEPPhase } from '../../shared/types/SEP';
import { Task, TaskPhase, TaskStatus } from '../../shared/types/Task';
import * as sepsUtils from './seps';
const globals = globalThis as unknown as BackendTestingGlobals;

describe('seps utils', () => {
  describe('updateSEPPhaseAndTasks', () => {
    it('should update from the "knockout" phase to the "initate" phase when all knockout screens are complete', async () => {
      await globals.db.SEP.update(
        { phase: SEPPhase.knockout },
        { where: { id: 1 } }
      );
      await globals.db.DataField.update(
        { value: 'Some value' },
        { where: { sepID: 1 } }
      );
      await sepsUtils.updateSEPPhaseAndTasks(globals.db, 1);
      expect(((await globals.db.SEP.findByPk(1)) as SEP).phase).toEqual(
        SEPPhase.initiate
      );
    });
    it('should enable all default tasks (based on knockout answers) when all knockout screens are complete', async () => {
      await globals.db.DataField.update(
        { value: 'Hello' },
        { where: { sepID: 3 } }
      );
      await sepsUtils.updateSEPPhaseAndTasks(globals.db, 3);
      const task = (await globals.db.Task.findByPk(3)) as Task;
      expect(task.enabled).toEqual(true);
    });
    it('should set all default tasks with no parent tasks to "todo" status when all knockout screens are complete', async () => {
      await globals.db.DataField.update(
        { value: 'Hello' },
        { where: { sepID: 3 } }
      );
      await sepsUtils.updateSEPPhaseAndTasks(globals.db, 3);
      const taskWithoutParent = (await globals.db.Task.findByPk(3)) as Task;
      const taskWithParent = (await globals.db.Task.findByPk(4)) as Task;
      expect(taskWithoutParent.status).toEqual(TaskStatus.todo);
      expect(taskWithParent.status).toEqual(TaskStatus.pending);
    });
    it('should update from the "initiate" phase to the "design" phase when all initate-phase enabled tasks are complete', async () => {
      const newSEP = (
        await globals.request.post('/sep').send({ name: 'My new sep' })
      ).body;
      await globals.db.SEP.update(
        { phase: SEPPhase.initiate },
        { where: { id: newSEP.id } }
      );
      await globals.db.Task.update(
        { status: TaskStatus.complete, enabled: true },
        { where: { phase: TaskPhase.initiate, sepID: newSEP.id } }
      );
      await sepsUtils.updateSEPPhaseAndTasks(globals.db, newSEP.id);
      expect(((await globals.db.SEP.findByPk(newSEP.id)) as SEP).phase).toEqual(
        SEPPhase.design
      );
    });
    it('should update from the "design" phase to the "implement" phase when all design-phase enabled tasks are complete', async () => {
      const newSEP = (
        await globals.request.post('/sep').send({ name: 'My new sep' })
      ).body;
      await globals.db.SEP.update(
        { phase: SEPPhase.design },
        { where: { id: newSEP.id } }
      );
      await globals.db.Task.update(
        { status: TaskStatus.complete, enabled: true },
        { where: { phase: TaskPhase.design, sepID: newSEP.id } }
      );
      await sepsUtils.updateSEPPhaseAndTasks(globals.db, newSEP.id);
      expect(((await globals.db.SEP.findByPk(newSEP.id)) as SEP).phase).toEqual(
        SEPPhase.implement
      );
    });
    it('should update from the "implement" phase to the "complete" phase when all implement-phase enabled tasks are complete', async () => {
      const newSEP = (
        await globals.request.post('/sep').send({ name: 'My new sep' })
      ).body;
      await globals.db.SEP.update(
        { phase: SEPPhase.implement },
        { where: { id: newSEP.id } }
      );
      await globals.db.Task.update(
        { status: TaskStatus.complete, enabled: true },
        { where: { phase: TaskPhase.implement, sepID: newSEP.id } }
      );
      await sepsUtils.updateSEPPhaseAndTasks(globals.db, newSEP.id);
      expect(((await globals.db.SEP.findByPk(newSEP.id)) as SEP).phase).toEqual(
        SEPPhase.complete
      );
    });
  });
});