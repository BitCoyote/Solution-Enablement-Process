import React from 'react';
import { Outlet } from "react-router-dom";
import { useIsAuthenticated, useMsalAuthentication, useMsal, useAccount } from "@azure/msal-react";
import { InteractionType, AccountInfo,SilentRequest } from "@azure/msal-browser";
import { useAppDispatch } from '../../app/hooks';
import axios, { AxiosRequestConfig } from 'axios';
import { getLoggedInUser } from './authSlice';
let interceptor: number;

export const Auth = () => {
  const isAuthenticated = useIsAuthenticated();
  const authRequest: SilentRequest = {
    scopes: ["openid", "profile"]
  };
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const { result, error } = useMsalAuthentication(InteractionType.Redirect, authRequest);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (result) {
      // User just started their session
      setRequestInterceptors(result.account as AccountInfo);
      requestUserData();
    }
  }, [result])
  React.useEffect(() => {
    if (account) {
      // User is refreshing an existing session
      setRequestInterceptors(account as AccountInfo);
      requestUserData()
    }
  }, [])
  const setRequestInterceptors = (account: AccountInfo) => {
    // If we have a previous request interceptor, we want to remove it so we can replace it with a new interceptor with new tokens.
    interceptor !== undefined &&
      axios.interceptors.request.eject(interceptor);
    interceptor = axios.interceptors.request.use(
      setUserHeaders(account)
    );
  }
  const setUserHeaders = (account: AccountInfo) => async (config: AxiosRequestConfig) => {
    const response = await instance.acquireTokenSilent({ ...authRequest, account })
    if (
      config.url &&
      (config.url.startsWith(
        process.env.REACT_APP_API_BASE_URL as string
      ))
    ) {
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'application/json';
      config.headers.Authorization = `Bearer ${response.idToken}`;
      config.headers.access_token = response.accessToken;
    }
    return config;
  };

  // Get user data from database.
  const requestUserData = React.useCallback(() => {
    dispatch(getLoggedInUser());
  }, [dispatch]);
  
  if (error) {
    return <div aria-label="Authentication error">An authentication error has occurred. Please refresh your browser.</div>
  } else if (inProgress !== 'none') {
    return <div>Redirecting...</div>
  } else if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <div aria-label="Unknown error">An unknown error has occurred. Please refresh your browser.</div>
  }
};

export default Auth;
