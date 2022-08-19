import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { loadUser } from 'redux-oidc';
import userManager from './auth/userManager';
import customOidcReducer from './auth/customOidcReducer';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    oidc: customOidcReducer
  },
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
loadUser(store, userManager);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
