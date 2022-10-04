import { sepSlice } from './';
import { AppStore, setupStore } from '../../app/store';

describe('sepSlice', () => {
  let store: AppStore;
  beforeEach(() => {
    store = setupStore();
  });
  it('should handle findSeps', async () => {
    const result = await store.dispatch(
      sepSlice.endpoints.findSeps.initiate({})
    );
    expect(result.status).toBe('fulfilled');
    expect(result?.data?.count).toBe(3);
  });

  it('should bring one SEP by id', async () => {
    const result = await store.dispatch(sepSlice.endpoints.getSep.initiate(1));
    expect(result.status).toBe('fulfilled');
    expect(result?.data?.name).toBe('Fantastic SEP');
  });
});
