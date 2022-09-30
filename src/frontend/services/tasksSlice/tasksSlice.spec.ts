import { tasksSlice } from './tasksSlice';
import { AppStore, setupStore } from '../../app/store';

describe('tasksSlice', () => {
  let store: AppStore;
  beforeEach(() => {
    store = setupStore();
  });
  it('should handle getTasks', async () => {
    const result = await store.dispatch(
      tasksSlice.endpoints.getTasks.initiate({})
    );
    expect(result.status).toBe('fulfilled');
  });
});
