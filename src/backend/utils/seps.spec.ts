import { BackendTestingGlobals } from '../../../testing/types';
import { SEP, SEPPhase } from '../../shared/types/SEP';
import { TaskPhase, TaskStatus } from '../../shared/types/Task';
import * as sepsUtils from './seps';
const globals = globalThis as unknown as BackendTestingGlobals;

describe('seps utils', () => {
  describe('updateSEPPhase', () => {
    it('should update from the "knockout" phase to the "initate" phase when all knockout screens are complete', async () => {
      // console.log(newSEP)
      await globals.db.SEP.update(
        { phase: SEPPhase.knockout },
        { where: { id: 1 } }
      );
      // await globals.db.DataFieldOption.update({ selected: true }, { where: { sepID: newSEP.id } });
      await globals.db.DataField.update(
        { value: 'Some value' },
        { where: { sepID: 1 } }
      );
      await sepsUtils.updateSEPPhase(globals.db, 1);
      expect(((await globals.db.SEP.findByPk(1)) as SEP).phase).toEqual(
        SEPPhase.initiate
      );
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
      await sepsUtils.updateSEPPhase(globals.db, newSEP.id);
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
      await sepsUtils.updateSEPPhase(globals.db, newSEP.id);
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
      await sepsUtils.updateSEPPhase(globals.db, newSEP.id);
      expect(((await globals.db.SEP.findByPk(newSEP.id)) as SEP).phase).toEqual(
        SEPPhase.complete
      );
    });
  });
});
