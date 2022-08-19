import * as React from 'react';
// import { connect } from 'react-redux';
import { CallbackComponent } from 'redux-oidc';
import { useNavigate } from "react-router-dom";
// import { push, CallHistoryMethodAction } from 'connected-react-router';
import userManager from './userManager';
// import { Path, LocationState } from 'history';
const CallbackComp = CallbackComponent as any;

const Callback = () => {
  const navigate = useNavigate();
  return (
    <CallbackComp
      userManager={userManager}
      successCallback={(t: any) => {
        navigate(t.state.originalUrl, { replace: true })
      }}
      errorCallback={(err: any) => {
        console.error('CallBack.tsx error response:', err);
        navigate('/error', { replace: true })
      }}
    >
      <div>Redirecting...</div>
    </CallbackComp>
  );
};

export default Callback;