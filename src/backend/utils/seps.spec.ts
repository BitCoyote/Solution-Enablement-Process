import { BackendTestingGlobals } from '../../../testing/types';
import { SEP, SEPPhase } from '../../shared/types/SEP';
import { Task, TaskPhase, TaskStatus } from '../../shared/types/Task';
import * as sepsUtils from './seps';
const globals = globalThis as unknown as BackendTestingGlobals;

describe('seps utils', () => {
  describe('updateSEPProgress', () => {
    describe('when the SEP is in the knockout phase', () => {
      it('should update from the "knockout" phase to the "initate" phase when all knockout screens are complete', async () => {
        await globals.db.SEP.update(
          { phase: SEPPhase.knockout },
          { where: { id: 1 } }
        );
        await globals.db.DataField.update(
          { value: 'Some value' },
          { where: { sepID: 1 } }
        );
        await sepsUtils.updateSEPProgress(globals.db, 1);
        expect(((await globals.db.SEP.findByPk(1)) as SEP).phase).toEqual(
          SEPPhase.initiate
        );
      });
      it('should enable all default tasks (based on knockout answers) when all knockout screens are complete', async () => {
        await globals.db.SEP.update(
          { phase: SEPPhase.knockout },
          { where: { id: 3 } }
        );
        await globals.db.DataField.update(
          { value: 'Hello' },
          { where: { sepID: 3 } }
        );
        await sepsUtils.updateSEPProgress(globals.db, 3);
        const task = (await globals.db.Task.findByPk(3)) as Task;
        expect(task.enabled).toEqual(true);
      });
      it('should set all default tasks with no parent tasks to "todo" status when all knockout screens are complete', async () => {
        await globals.db.DataField.update(
          { value: 'Hello' },
          { where: { sepID: 3 } }
        );
        await sepsUtils.updateSEPProgress(globals.db, 3);
        const taskWithoutParent = (await globals.db.Task.findByPk(3)) as Task;
        const taskWithParent = (await globals.db.Task.findByPk(4)) as Task;
        expect(taskWithoutParent.status).toEqual(TaskStatus.todo);
        expect(taskWithParent.status).toEqual(TaskStatus.pending);
      });
    });
    describe('when the SEP is in the initiate, design, or implement phase', () => {
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
        await sepsUtils.updateSEPProgress(globals.db, newSEP.id);
        expect(
          ((await globals.db.SEP.findByPk(newSEP.id)) as SEP).phase
        ).toEqual(SEPPhase.design);
      }, 10000);
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
        await sepsUtils.updateSEPProgress(globals.db, newSEP.id);
        expect(
          ((await globals.db.SEP.findByPk(newSEP.id)) as SEP).phase
        ).toEqual(SEPPhase.implement);
      }, 10000);
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
        await sepsUtils.updateSEPProgress(globals.db, newSEP.id);
        expect(
          ((await globals.db.SEP.findByPk(newSEP.id)) as SEP).phase
        ).toEqual(SEPPhase.complete);
      }, 10000);
      it('should lock tasks in the same phase if all tasks in the same phase are complete', async () => {
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
        await sepsUtils.updateSEPProgress(globals.db, newSEP.id);
        const unlockedTaskCount = await globals.db.Task.count({
          where: { phase: 'initiate', sepID: newSEP.id, locked: false },
        });
        expect(unlockedTaskCount).toEqual(0);
      }, 10000);
    });
  });
});
