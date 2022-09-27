import React from 'react';
import { renderWithProviders } from '../../../testing/test-utils';
import '@testing-library/jest-dom';
import App from './App';
import { usersSlice } from '../services/usersSlice/usersSlice'
import { FrontendTestingGlobals } from '../../../testing/types';
import { waitFor } from '@testing-library/react';
const globals = globalThis as unknown as FrontendTestingGlobals;

describe('App component', () => {
  it('should render react learning link  and get the logged-in user information', async () => {
    const { getByText, store } = renderWithProviders(<App />);
    expect(getByText(/learn/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(
        usersSlice.endpoints.getUser.select('me')(store.getState()).data?.id
      ).toEqual(globals.loggedInUserID)
    );
  });
});
