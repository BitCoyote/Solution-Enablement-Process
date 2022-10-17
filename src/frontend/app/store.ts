import {
  configureStore,
  ThunkAction,
  Action,
  PreloadedState,
  combineReducers,
} from '@reduxjs/toolkit';
import counterReducer from '../services/counterSlice/counterSlice';
import appReducer from '../services/appSlice/appSlice';
import { sepAPI } from '../services/API';
import { microsoftAPI } from '../services/API/microsoftAPI';

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  app: appReducer,
  counter: counterReducer,
  [sepAPI.reducerPath]: sepAPI.reducer,
  [microsoftAPI.reducerPath]: microsoftAPI.reducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(sepAPI.middleware),
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
