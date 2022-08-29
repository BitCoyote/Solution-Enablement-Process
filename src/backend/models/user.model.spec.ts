const globals = globalThis as any;

describe('User model', () => {
    describe('beforeUpdateHook', () => {
        it('should throw an error if trying to update the "system" user', async () => {
            const systemUser = await globals.db.User.findByPk('system');
            await expect(systemUser.update({ surname: 'Falafel' })).rejects.toThrow('Cannot update system user.');
        });

    });
});