import React from 'react';
import { renderWithProviders } from '../../../../testing/test-utils'
import '@testing-library/jest-dom';
import Auth from './Auth';
import msal, { IMsalContext, MsalAuthenticationResult } from '@azure/msal-react';
import { FrontendTestingGlobals } from '../../../../testing/types';
import * as authSlice from './authSlice';
import axios from 'axios';
import { waitFor } from '@testing-library/react';
const globals = globalThis as unknown as FrontendTestingGlobals;

// For testing the Auth component, we need to mock @azure/msal-react because we Microsoft does not permit headless browsers to authenticate.
// This will be the default mock for @azure/msal-react for this file. Methods can be overwritten in individual tests use jest.spyOn
jest.mock('@azure/msal-react', () => {
    return {
        'useIsAuthenticated': () => false,
        'useMsalAuthentication': () => ({ result: {}, error: null }),
        'useMsal': () => ({
            instance: false,
            accounts: [{}],
            inProgress: 'none'
        }),
        'useAccount': () => ({}),
    }
})
describe('Auth component', () => {
    it('Should show the router outlet when the user is authenticated', async () => {
        jest.spyOn(msal, 'useIsAuthenticated').mockReturnValueOnce(true);
        const { queryByText, queryByLabelText } = renderWithProviders(<Auth />);
        expect(queryByText('Redirecting...')).not.toBeInTheDocument();
        expect(queryByLabelText('Unknown error')).not.toBeInTheDocument();
        expect(queryByLabelText('Authentication error')).not.toBeInTheDocument();
    });
    it('Should show an error message when there is an authentication error.', async () => {
        jest.spyOn(msal, 'useMsalAuthentication').mockReturnValueOnce({ error: {} } as MsalAuthenticationResult);
        const { getByLabelText } = renderWithProviders(<Auth />);
        expect(getByLabelText('Authentication error')).toBeInTheDocument();
    });
    it('Should show an error message when there is an unknown error.', async () => {
        const { getByLabelText } = renderWithProviders(<Auth />);
        expect(getByLabelText('Unknown error')).toBeInTheDocument();
    });
    it('Should show "Redirecting..." when MSAL is in progress.', async () => {
        jest.spyOn(msal, 'useMsal').mockReturnValueOnce({
            instance: false,
            accounts: [{}],
            inProgress: true
        } as unknown as IMsalContext);
        const { getByText } = renderWithProviders(<Auth />);
        expect(getByText('Redirecting...')).toBeInTheDocument();
    });
    it('should request the logged-in user data when authenticated', async () => {
        jest.spyOn(msal, 'useIsAuthenticated').mockReturnValueOnce(true);
        jest.spyOn(msal, 'useMsalAuthentication').mockReturnValueOnce({ error: null } as MsalAuthenticationResult);
        jest.spyOn(msal, 'useMsal').mockReturnValueOnce({
            instance: {
                acquireTokenSilent: () => ({
                    idToken: globals.idToken,
                    accessToken: globals.accessToken
                })
            },
            accounts: [{}],
            inProgress: true
        } as unknown as IMsalContext);
        const requestSpy = jest.spyOn(axios.interceptors.request, 'use');
        const getSpy = jest.spyOn(axios, 'get');
        const getLoggedInUserSpy = jest.spyOn(authSlice, 'getLoggedInUser');
        const {store} = renderWithProviders(<Auth />);
        await waitFor(() => expect(store.getState().auth.user).toBeTruthy());
        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(getLoggedInUserSpy).toHaveBeenCalledTimes(1);
    });

});
