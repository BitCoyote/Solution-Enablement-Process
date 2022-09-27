import { BackendTestingGlobals } from '../../../testing/types';
import { TaskModel } from './task.model';
import * as sepsUtils from '../utils/seps';
const globals = globalThis as unknown as BackendTestingGlobals;

describe('DataField model', () => {
  describe('afterUpdate Hook', () => {
    it('should call updateSEPPhase', async () => {
      const updateSEPPhaseSpy = jest
        .spyOn(sepsUtils, 'updateSEPPhase')
        .mockImplementation(jest.fn());
      const dataField = (await globals.db.Task.findOne()) as TaskModel;
      await dataField.update({ status: 'complete' });
      expect(updateSEPPhaseSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('afterCreate Hook', () => {
    it('should call updateSEPPhase', async () => {
      const updateSEPPhaseSpy = jest
        .spyOn(sepsUtils, 'updateSEPPhase')
        .mockImplementation(jest.fn());
      await globals.db.Task.create({
        createdBy: 'system',
        name: 'hello',
        review: false,
        enabled: true,
        status: 'todo',
        phase: 'design',
        sepID: 1,
      });
      expect(updateSEPPhaseSpy).toHaveBeenCalledTimes(1);
    });
  });
});
