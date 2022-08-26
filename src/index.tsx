import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { setupStore } from './frontend/app/store';
import App from './frontend/app/App';
import reportWebVitals from './frontend/reportWebVitals';
import './frontend/app/index.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Auth from './frontend/features/auth/Auth';
import { MsalProvider } from "@azure/msal-react";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";
const container = document.getElementById('root')!;
const root = createRoot(container);
const store = setupStore();
const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
    redirectUri: process.env.REACT_APP_REDIRECT_URI as string
  }
};
const pca = new PublicClientApplication(msalConfig);

root.render(
  <Provider store={store}>
    <MsalProvider instance={pca}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />}>
            <Route index element={<App />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MsalProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
