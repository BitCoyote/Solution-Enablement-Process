import React from 'react';
import { renderWithProviders } from '../../../../testing/test-utils';
import '@testing-library/jest-dom';
import Auth from './Auth';
import msalReact, {
  IMsalContext,
  MsalAuthenticationResult,
} from '@azure/msal-react';
import { FrontendTestingGlobals } from '../../../../testing/types';
import { waitFor } from '@testing-library/react';
//import * as sep from '../../services/API/sepAPI';
import * as usersSlice from '../../services/usersSlice';
const globals = globalThis as unknown as FrontendTestingGlobals;
// For testing the Auth component, we need to mock @azure/msal-react because we Microsoft does not permit headless browsers to authenticate.
// This will be the default mock for @azure/msal-react for this file. Methods can be overwritten in individual tests use jest.spyOn
jest.mock('@azure/msal-react', () => {
  return {
    useIsAuthenticated: () => false,
    useMsalAuthentication: () => ({ error: null }),
    useMsal: () => ({
      inProgress: 'none',
      accounts: [],
    }),
    useAccount: () => null,
  };
});
describe('Auth component', () => {
  it('Should show an error message when there is an MSAL authentication error.', async () => {
    jest.spyOn(msalReact, 'useIsAuthenticated').mockReturnValueOnce(false);
    jest
      .spyOn(msalReact, 'useMsalAuthentication')
      .mockReturnValueOnce({ error: {} } as MsalAuthenticationResult);
    const { getByLabelText } = renderWithProviders(<Auth />);
    expect(getByLabelText('Authentication error')).toBeInTheDocument();
  });
  it('Should show an error message when there is a server error.', async () => {
    jest
      .spyOn(usersSlice, 'useGetUserQuery')
      .mockReturnValueOnce({ error: {}, data: null, refetch: jest.fn() });
    jest.spyOn(msalReact, 'useIsAuthenticated').mockReturnValueOnce(true);
    const { getByLabelText } = renderWithProviders(<Auth />);
    expect(getByLabelText('Server error')).toBeInTheDocument();
  });
  it('Should show an error message when there is an unknown error.', async () => {
    const { getByLabelText } = renderWithProviders(<Auth />);
    expect(getByLabelText('Unknown error')).toBeInTheDocument();
  });
  it('Should show "Redirecting..." when MSAL is in progress.', async () => {
    jest.spyOn(msalReact, 'useMsal').mockReturnValueOnce({
      inProgress: 'ssoSilent',
      accounts: [],
    } as unknown as IMsalContext);
    const { getByText } = renderWithProviders(<Auth />);
    expect(getByText('Redirecting...')).toBeInTheDocument();
  });

  it('Should show "Loading user..." when the user request is in progress.', async () => {
    jest.spyOn(usersSlice, 'useGetUserQuery').mockReturnValueOnce({
      error: null,
      isLoading: true,
      data: null,
      refetch: jest.fn(),
    });
    const { getByText } = renderWithProviders(<Auth />);
    expect(getByText('Loading user...')).toBeInTheDocument();
  });
  it('should request the logged-in user data when authenticated', async () => {
    msalReact.useIsAuthenticated = jest.fn(() => true);
    jest.spyOn(msalReact, 'useMsal').mockReturnValueOnce({
      inProgress: 'none',
      accounts: [{ tenantId: process.env.REACT_APP_TENANT_ID }],
    } as unknown as IMsalContext);

    const { store, queryByText, queryByLabelText } = renderWithProviders(
      <Auth />
    );
    await waitFor(() => {
      expect(queryByText('Loading user...')).not.toBeInTheDocument();
      expect(queryByText('Redirecting...')).not.toBeInTheDocument();
      expect(queryByLabelText('Unknown error')).not.toBeInTheDocument();
      expect(queryByLabelText('Server error')).not.toBeInTheDocument();
      expect(queryByLabelText('Authentication error')).not.toBeInTheDocument();
      expect(
        usersSlice.usersSlice.endpoints.getUser.select('me')(store.getState())
          .data?.id
      ).toEqual(globals.loggedInUserID);
    });
  });
});
