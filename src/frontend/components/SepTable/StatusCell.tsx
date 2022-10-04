import { Box, Typography } from '@mui/material';
import React from 'react';
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
  <Box display="flex" alignItems="center">
    {icon}
    <Typography color={color}>{text}</Typography>
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
          <i className="fa-solid fa-hand-wave" style={{ color: '#F47B27' }}></i>
        }
        color="solidOrange.main"
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
        color="darkGreen.main"
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
        color="solidBlue.main"
        text={status.toString()}
      />
    );
  }
  return <Box>{status}</Box>;
};

export default StatusCell;
