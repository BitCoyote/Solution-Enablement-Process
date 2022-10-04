import { BackendTestingGlobals } from '../../../testing/types';
import { KnockoutFollowupModel } from './knockout-followup.model';

const globals = globalThis as unknown as BackendTestingGlobals;

describe('KnockoutFollowup model', () => {
  describe('afterFind', () => {
    it('should cast values to their original type when many models are returned from the db', async () => {
      const knockoutFollowups =
        (await globals.db.KnockoutFollowup.findAll()) as KnockoutFollowupModel[];
      expect(typeof knockoutFollowups[0].value).toEqual('string');
    });
    it('should cast values to their original type when a single model is returned from the db', async () => {
      const knockoutFollowup = (await globals.db.KnockoutFollowup.findByPk(
        1
      )) as KnockoutFollowupModel;
      expect(typeof knockoutFollowup.value).toEqual('string');
    });
  });
});
