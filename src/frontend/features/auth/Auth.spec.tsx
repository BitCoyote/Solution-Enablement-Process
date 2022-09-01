import React from 'react';
import { renderWithProviders } from '../../../../testing/test-utils'
import '@testing-library/jest-dom';
import Auth from './Auth';
jest.mock('@azure/msal-react', () => {
    return {
        'useIsAuthenticated': () => false,
        'useMsalAuthentication': () => ({ result: false, error: false }),
        'useMsal': () => ({
            instance: false,
            accounts: [{}],
            inProgress: true
        }),
        'useAccount': () => ({}),
    }
})

describe('Auth component', () => {
    it('Should show "Redirecting..." when MSAL is in progress.', async () => {
        const { getByText } = renderWithProviders(<Auth />);
        expect(getByText('Redirecting...')).toBeInTheDocument();
    });
});
