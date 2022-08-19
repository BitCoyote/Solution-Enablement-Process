import React, { useEffect } from 'react';
// import { getUserInfo } from '../redux/actions/user/actions';
import { Outlet } from "react-router-dom";
import userManager from './userManager';
// import { useAppDispatch } from '../hooks';
import { useAppSelector } from '../hooks';
import { selectOidcUser, selectOidcUserLoading } from './customOidcReducer';

export const Auth = () => {
  // const dispatch = useAppDispatch();
  const oidcUser = useAppSelector(selectOidcUser);
  const oidcUserLoading = useAppSelector(selectOidcUserLoading);
  // Redirect user to Azure sign on screen if they do not have a session.
  useEffect(() => {
    if (!oidcUser && !oidcUserLoading && window.location.pathname !== '/callback' && window.location.pathname !== '/error') {
      userManager.signinRedirect({
        state: {
          originalUrl: window.location.pathname + window.location.search
        }
      });
    }
  }, [oidcUser, oidcUserLoading]);

  // Get user data on from session storage or from database.
  // const requestUserData = React.useCallback(() => {
  //   if (user) {
  //     // dispatch(getUserInfo('me'));

  //   }
  // }, [dispatch, user]);
  // React.useEffect(requestUserData, [user, requestUserData]);
  if (oidcUser || window.location.pathname === '/callback' || window.location.pathname === '/error') {
    return <Outlet />;
  } else {
    return null;
  }
};

export default Auth;
