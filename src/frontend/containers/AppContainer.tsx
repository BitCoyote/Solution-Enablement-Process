import { Box, Container } from "@mui/material";
import React from "react";
import { Outlet } from "react-router";
import ResponsiveAppBar from "../components/appbar/AppBar";

const AppContainer = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <ResponsiveAppBar />
      <Box display="flex" flexDirection="column" flexGrow={1} py="24px">
        <Container
          maxWidth="xl"
          sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AppContainer;
