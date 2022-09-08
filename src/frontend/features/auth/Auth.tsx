import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  useAccount,
  useIsAuthenticated,
  useMsal,
  useMsalAuthentication,
} from '@azure/msal-react';
import { useGetUserQuery } from '../../services/sepAPI';
import { InteractionType } from '@azure/msal-browser';
import { authRequest } from '../../../frontend/app/msal';
import pca from '../../app/msal';
export const Auth = () => {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress, accounts } = useMsal();
  const {
    data: loggedInUser,
    error: getUserError,
    isLoading,
  } = useGetUserQuery('me', {
    skip: !isAuthenticated,
  });
  const { error: msalError } = useMsalAuthentication(
    InteractionType.Redirect,
    authRequest
  );
  const accountToUse = accounts.find(
    (account) => account.tenantId === process.env.REACT_APP_TENANT_ID
  );
  const account = useAccount();
  React.useEffect(() => {
    if (!account && accountToUse) {
      // If there is no active account, set one.
      pca.setActiveAccount(accountToUse);
    }
  }, [accountToUse, account]);

  if (msalError) {
    return (
      <p aria-label="Authentication error">
        An authentication error has occurred. Please refresh your browser.
      </p>
    );
  } else if (getUserError) {
    return (
      <p aria-label="Server error">
        A server error has occurred. Please refresh your browser.
      </p>
    );
  } else if (inProgress !== 'none') {
    return <p>Redirecting...</p>;
  } else if (isLoading) {
    return <p>Loading user...</p>;
  } else if (isAuthenticated && loggedInUser) {
    return <Outlet />;
  } else {
    return (
      <p aria-label="Unknown error">
        An unknown error has occurred. Please refresh your browser.
      </p>
    );
  }
};

export default Auth;
