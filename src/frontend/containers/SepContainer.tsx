import React from 'react'
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Outlet } from 'react-router';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const Login = () => {

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
          p: 2.7
        }}
      >
        <Box sx={{
          alignItems: 'flex-start',

        }}>
          <Button variant="text" > <ChevronLeftIcon/> Back </Button>
          <Container maxWidth="lg"
            sx={{
              bgcolor: '#FFFFFF',
              minHeight: '85vh',
              minWidth: '90vw',
              borderRadius: '10px',
              boxShadow:'0px 1px 5px #0000001A;',
              m:2
            }} >
              <Outlet />
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Login;
