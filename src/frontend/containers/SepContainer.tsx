import React from 'react';
import { Box, Button, Container } from '@mui/material';
import { Outlet, useNavigate } from 'react-router';

const Login = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100vh',
          minWidth: '100%vw',
          bgcolor: '#FBFCFC',
          flexDirection: 'column',
          p: 3,
        }}
      >
        <Box
          sx={{
            alignItems: 'flex-start',
          }}
        >
          <Button variant="text" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-angle-left"></i> &nbsp; Back
          </Button>
          <Container
            maxWidth="lg"
            sx={{
              bgcolor: '#FFFFFF',
              minHeight: '85vh',
              minWidth: '90vw',
              borderRadius: '10px',
              boxShadow: '0px 1px 5px #0000001A;',
              padding: '0px !important',
              marginTop: '25px',
            }}
          >
            <Outlet />
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Login;
