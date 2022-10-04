import React from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { TaskStatus } from '../../../shared/types/Task';

const CellItem = ({
  icon,
  text,
  color,
}: {
  icon: React.ReactNode;
  text: string;
  color: string;
}) => (
  <Box
    display="flex"
    alignItems="center"
    px="16px"
    py="1px"
    sx={{
      backgroundColor: alpha(color, 0.05),
      borderRadius: '100px',
    }}
  >
    {icon}
    <Typography fontSize="16px" fontWeight="600" color={color} ml="4px">
      {text}
    </Typography>
  </Box>
);

const StatusCell = ({ status }: { status: TaskStatus }) => {
  if (
    status === TaskStatus.inReview ||
    status === TaskStatus.changesRequested
  ) {
    return (
      <CellItem
        icon={
          <i
            className="fa-regular fa-hand-wave"
            style={{ color: '#F47B27' }}
          ></i>
        }
        color="#F47B27"
        text={status.toString()}
      />
    );
  }
  if (status === TaskStatus.complete) {
    return (
      <CellItem
        icon={
          <i className="fa-solid fa-check" style={{ color: '#6BA543' }}></i>
        }
        color="#6BA543"
        text={status.toString()}
      />
    );
  }
  if (status === TaskStatus.todo) {
    return (
      <CellItem
        icon={
          <i
            className="fa-solid fa-note-sticky"
            style={{ color: '#2372B9' }}
          ></i>
        }
        color="#2372B9"
        text={status.toString()}
      />
    );
  }
  if (status === TaskStatus.pending) {
    return (
      <CellItem
        icon={
          <i
            className="fa-regular fa-ellipsis"
            style={{ color: '#7e8083' }}
          ></i>
        }
        color="#7e8083"
        text={status.toString()}
      />
    );
  }
  return <Box>{status}</Box>;
};

export default StatusCell;
