import React from 'react';
import ResponsiveAppBar from '../components/Appbar';
import SepContainer from './SepContainer';
import Snackbar from '@mui/material/Snackbar';
import { selectSnackbar, setSnackbar } from '../services/appSlice/appSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" sx={{cursor: 'pointer'}} {...props} />;
});


const AppContainer = () => {
  const snackbar = useAppSelector(selectSnackbar);
  const dispatch = useAppDispatch();
  return (
    <>
      <ResponsiveAppBar />
      <SepContainer />
      <Snackbar key={snackbar?.text} open={!!snackbar} onClick={()=>dispatch(setSnackbar(null))}>
        <Alert severity={snackbar?.type}>{snackbar?.text}</Alert>
      </Snackbar>
    </>
  );
};

export default AppContainer;
