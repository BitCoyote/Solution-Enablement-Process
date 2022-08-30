import  {
    getLoggedInUser, selectUser
} from './authSlice';
import { AppStore, setupStore } from '../../app/store';

describe('authSlice', () => {
    let store: AppStore;
    beforeEach(() => {
        store = setupStore();
    });
    it('should handle getLoggedInUser', async () => {
        expect(store.getState().auth.user).toBeNull();
        await store.dispatch(getLoggedInUser());
        const user = store.getState().auth.user
        expect(user).not.toBeNull();
        expect(selectUser(store.getState())).toEqual(user);
    });
});
