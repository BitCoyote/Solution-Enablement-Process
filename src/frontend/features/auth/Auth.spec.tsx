import React from 'react';
import { renderWithProviders } from '../../../../testing/test-utils'
import '@testing-library/jest-dom';
import Auth from './Auth';
import msal, { IMsalContext, MsalAuthenticationResult } from '@azure/msal-react';
import { AccountInfo } from '@azure/msal-browser';
import axios from 'axios';
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
    it('should attach user tokens to axios request interceptors and request the logged-in user data when authenticated', async () => {
        jest.spyOn(msal, 'useIsAuthenticated').mockReturnValueOnce(true);
        jest.spyOn(msal, 'useMsalAuthentication').mockReturnValueOnce({ error: null } as MsalAuthenticationResult);
        jest.spyOn(msal, 'useMsal').mockReturnValueOnce({
            instance: false,
            accounts: [{}],
            inProgress: true
        } as unknown as IMsalContext);
        const spy = jest.spyOn(axios.interceptors.request, 'use');
        renderWithProviders(<Auth />);
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
