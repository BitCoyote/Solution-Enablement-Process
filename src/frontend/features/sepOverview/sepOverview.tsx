import React from 'react';
import { useParams } from 'react-router';
import { useGetSepExtendedQuery } from '../../services/sepSlice';
import { Box, CircularProgress } from '@mui/material';
import SepHeader from './SepHeader';

const SepOverview = () => {
  const { sepId } = useParams();
  const { data: sep, isLoading: sepLoading } = useGetSepExtendedQuery(
    Number(sepId)
  );

  return (
    <>
      {sepLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
        <SepHeader sep={sep} />
      )}
    </>
  );
};

export default SepOverview;
