import { BackendTestingGlobals } from '../../../testing/types';
import { UserModel } from './user.model';

const globals = globalThis as unknown as BackendTestingGlobals;

describe('User model', () => {
  describe('beforeUpdateHook', () => {
    it('should throw an error if trying to update the "system" user', async () => {
      const systemUser = (await globals.db.User.findByPk(
        'system'
      )) as UserModel;
      await expect(systemUser.update({ surname: 'Falafel' })).rejects.toThrow(
        'Cannot update system user.'
      );
    });
  });
});
