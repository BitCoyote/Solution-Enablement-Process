import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './frontend/app/store';
import App from './frontend/app/App';
import reportWebVitals from './frontend/reportWebVitals';
import './frontend/app/index.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Auth from './frontend/app/auth/Auth';
import Callback from './frontend/app/auth/Callback';
import { OidcProvider } from 'redux-oidc';
import userManager from './frontend/app/auth/userManager';

const container = document.getElementById('root')!;
const root = createRoot(container);
const AuthProvider = OidcProvider as any;
root.render(
  <Provider store={store}>
    <AuthProvider userManager={userManager} store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />}>
            <Route index element={<App />} />
            <Route path="callback" element={<Callback />} />
            <Route path="error" element={<div>An unknown error occurred.</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
