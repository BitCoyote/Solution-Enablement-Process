import React from "react";
import { Outlet } from "react-router";
import ResponsiveAppBar from "../components/appbar/AppBar";
import SepContainer from "./SepContainer";

const AppContainer = () => {
  return (
    <>
      <ResponsiveAppBar />
      <SepContainer />
    </>
  );
};

export default AppContainer;
