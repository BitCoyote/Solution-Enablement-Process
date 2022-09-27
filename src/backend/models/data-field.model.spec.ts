import { BackendTestingGlobals } from '../../../testing/types';
import { DataFieldModel } from './data-field.model';
import * as sepsUtils from '../utils/seps';
const globals = globalThis as unknown as BackendTestingGlobals;

describe('DataField model', () => {
  describe('afterUpdate Hook', () => {
    it('should call updateSEPPhase', async () => {
      const updateSEPPhaseSpy = jest
        .spyOn(sepsUtils, 'updateSEPPhase')
        .mockImplementation(jest.fn());
      const dataField =
        (await globals.db.DataField.findOne()) as DataFieldModel;
      await dataField.update({ value: 'Falafel' });
      expect(updateSEPPhaseSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('afterCreate Hook', () => {
    it('should call updateSEPPhase', async () => {
      const updateSEPPhaseSpy = jest
        .spyOn(sepsUtils, 'updateSEPPhase')
        .mockImplementation(jest.fn());
      await globals.db.DataField.create({
        createdBy: 'system',
        name: 'hello',
        type: 'input',
        sepID: 1,
      });
      expect(updateSEPPhaseSpy).toHaveBeenCalledTimes(1);
    });
  });
});
