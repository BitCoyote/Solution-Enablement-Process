import { sepAPI } from './sepAPI';
import {usersSlice} from '../usersSlice/usersSlice'
import { AppStore, setupStore } from '../../app/store';
import { FrontendTestingGlobals } from '../../../../testing/types';
const globals = globalThis as unknown as FrontendTestingGlobals;

describe('sepAPI', () => {
  let store: AppStore;
  beforeEach(() => {
    store = setupStore();
  });
  it('should handle getUser', async () => {
    const result = await store.dispatch(
      usersSlice.endpoints.getUser.initiate(globals.loggedInUserID)
    );
    expect(result.status).toBe('fulfilled');
    expect(result.data?.id).toBe(globals.loggedInUserID);
  });
});
