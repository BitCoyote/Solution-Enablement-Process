import counterReducer, {
  CounterState,
  increment,
  decrement,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from './counterSlice';
import { AppStore, setupStore } from '../../app/store';

describe('counterSlice', () => {
  let store: AppStore;
  const initialState: CounterState = {
    value: 3,
    status: 'idle',
  };

  beforeEach(() => {
    store = setupStore();
  });

  it('should handle fulfilled incrementAsync', async () => {
    const amount = 10;
    await store.dispatch(incrementAsync(amount));
    const count = store.getState().counter.value
    expect(count).toEqual(amount);
    expect(selectCount(store.getState())).toEqual(amount);
    expect(store.getState().counter.status).toEqual('idle');
  });

  it('should handle rejected incrementAsync', async () => {
    // await store.dispatch(incrementAsync(1));
    // const count = store.getState().counter.status
    // expect(count).toEqual(amount);
    // expect(selectCount(store.getState())).toEqual(amount);
  });
  it('should handle pending incrementAsync', async () => {
    // await store.dispatch(incrementAsync(1));
    // const count = store.getState().counter.value
    // expect(count).toEqual(amount);
    // expect(selectCount(store.getState())).toEqual(amount);
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
});
