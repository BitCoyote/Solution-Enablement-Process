import { sepSlice } from './';
import { AppStore, setupStore } from '../../app/store';
import { FrontendTestingGlobals } from '../../../../testing/types';
//const globals = globalThis as unknown as FrontendTestingGlobals;

describe('sepSlice', () => {
    let store: AppStore;
    beforeEach(() => {
        store = setupStore();
    });
    it('should handle findSeps', async () => {
        const result = await store.dispatch(
            sepSlice.endpoints.findSeps.initiate()
        );
        expect(result.status).toBe('fulfilled');
        expect(result?.data?.count).toBe(2);
    });

    it('should bring one SEP by id', async () => {
        const result = await store.dispatch(
            sepSlice.endpoints.getSep.initiate(1)
        )
        console.log("🚀 ~ file: sep.spec.ts ~ line 24 ~ it.only ~ result", result)
        expect(result.status).toBe('fulfilled')
        expect(result?.data?.name).toBe('Fantastic SEP')
    })
});
