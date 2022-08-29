import { SuperTest, Test } from 'supertest';
describe('User module', () => {
    const globals = globalThis as any;

    describe('POST /roles', () => {
        it('should successfully create a role and return the created role ', async () => {
            const response = await (globals.request as SuperTest<Test>)
                .post(`/roles`)
                .send({ name: 'Blorg', description: 'You can blorg!', superUser: false })
                .expect(200);
            expect(response.body.name).toEqual('Blorg');
            expect((await globals.db.Role.findByPk(response.body.id)).name).toEqual('Blorg');
        });
    });

});
