import { configureStore, ThunkAction, Action, PreloadedState, combineReducers } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  counter: counterReducer,

})

export const setupStore = (preloadedState?: PreloadedState<RootState>) => configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state
        ignoredPaths: ['oidc.user'],
        // Ignore these action types
        ignoredActions: ['redux-oidc/USER_FOUND'],
      },
    }),

});

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
