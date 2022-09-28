import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { setupStore } from "./frontend/app/store";
import App from "./frontend/app/App";
import reportWebVitals from "./frontend/reportWebVitals";
import "./frontend/app/index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./frontend/features/auth/Auth";
import AppContainer from "./frontend/containers/AppContainer";
import ThemeProvider from "./frontend/theme/ThemeProvider";
import AllSEPs from "./frontend/features/allSEPs/AllSEPs";
import MySEPs from "./frontend/features/mySEPs/MySEPs";

import { MsalProvider } from "@azure/msal-react";
import pca from "./frontend/app/msal";
const container = document.getElementById("root")!;
const root = createRoot(container);
const store = setupStore();

root.render(
  <Provider store={store}>
    <MsalProvider instance={pca}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />}>
              <Route element={<AppContainer />}>
                <Route index element={<App />} />
                <Route path="/all-seps" element={<AllSEPs />} />
                <Route path="/my-seps" element={<MySEPs />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </MsalProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
