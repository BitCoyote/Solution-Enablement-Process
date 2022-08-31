import { BackendTestingGlobals } from '../../../../testing/types';
import { RoleModel } from '../../models/role.model';
describe('User module', () => {
    const globals = globalThis as unknown as BackendTestingGlobals;

    describe('POST /roles', () => {
        it('should successfully create a role and return the created role ', async () => {
            const response = await (globals.request)
                .post(`/roles`)
                .send({ name: 'Blorg', description: 'You can blorg!', superUser: false })
                .expect(200);
            expect(response.body.name).toEqual('Blorg');
            expect((await globals.db.Role.findByPk(response.body.id) as RoleModel).name).toEqual('Blorg');
        });
    });

});
