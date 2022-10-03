import React from 'react';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

const MuiButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.darkgray.main,
  display: 'block',
  textTransform: 'none',
  padding: '12px',
  font: 'normal normal 600 14px/19px Open Sans;',
  '&:hover': {
    backgroundColor: theme.palette.solidBlue.lightHover,
    color: theme.palette.solidBlue.main,
  },
  '&:active': {
    backgroundColor: theme.palette.solidBlue.lightActive,
    color: theme.palette.solidBlue.main,
  },
}));

const NavButton = (props: any) => <MuiButton {...props} />;

export default NavButton;
