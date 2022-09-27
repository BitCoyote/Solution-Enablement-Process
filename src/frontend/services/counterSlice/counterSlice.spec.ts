import counterReducer, {
  CounterState,
  increment,
  decrement,
  incrementByAmount,
  incrementAsync,
  selectCount,
  incrementIfOdd,
} from './counterSlice';
import { AppStore, setupStore } from '../../app/store';
import { createAsyncThunk } from '@reduxjs/toolkit';

describe('counterSlice', () => {
  let store: AppStore;
  const initialState: CounterState = {
    value: 3,
    status: 'idle',
  };

  beforeEach(() => {
    store = setupStore();
  });

  it('should handle increment', () => {
    const actual = counterReducer(initialState, increment());
    expect(actual.value).toEqual(4);
  });

  it('should handle decrement', () => {
    const actual = counterReducer(initialState, decrement());
    expect(actual.value).toEqual(2);
  });

  it('should handle incrementByAmount', () => {
    const actual = counterReducer(initialState, incrementByAmount(2));
    expect(actual.value).toEqual(5);
  });
  describe('incrementAsync', () => {
    it('should set status to "loading" when pending', async () => {
      Promise.resolve();
      const pendingIncrementAsync = createAsyncThunk(
        'counter/incrementAsync',
        async () => {
          return new Promise(() => ({}));
        }
      );
      store.dispatch(pendingIncrementAsync());
      const status = store.getState().counter.status;
      expect(status).toEqual('loading');
    });
    it('should update the count and status when fulfilled', async () => {
      const amount = 10;
      await store.dispatch(incrementAsync(amount));
      const count = store.getState().counter.value;
      expect(count).toEqual(amount);
      expect(selectCount(store.getState())).toEqual(amount);
      expect(store.getState().counter.status).toEqual('idle');
    });
    it('should set status to "failed" when rejected', async () => {
      const rejectedIncrementAsync = createAsyncThunk(
        'counter/incrementAsync',
        async () => {
          throw Error();
        }
      );
      await store.dispatch(rejectedIncrementAsync());
      const status = store.getState().counter.status;
      expect(status).toEqual('failed');
    });
  });

  describe('incrementIfOdd', () => {
    it('should increment the count if the current count is odd', () => {
      store.dispatch(incrementIfOdd(4));
      const count = store.getState().counter.value;
      expect(count).toEqual(0);
      expect(selectCount(store.getState())).toEqual(0);
    });
    it('should not increment the count if the current count is even', () => {
      store = setupStore({ counter: { value: 1, status: 'idle' } });
      store.dispatch(incrementIfOdd(4));
      const count = store.getState().counter.value;
      expect(count).toEqual(5);
      expect(selectCount(store.getState())).toEqual(5);
    });
  });
});
