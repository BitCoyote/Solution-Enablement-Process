import { Box, Typography } from '@mui/material';
import React from 'react';
import { TaskStatus } from '../../../shared/types/Task';
import { ReactComponent as HandWaveIcon } from '../../assets/svg/Hand-wave.svg';
import { ReactComponent as NoteIcon } from '../../assets/svg/Note.svg';
import { ReactComponent as CheckIcon } from '../../assets/svg/Check.svg';

const CellItem = ({
  icon,
  text,
  color,
}: {
  icon: JSX.Element;
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
        icon={<HandWaveIcon />}
        color="solidOrange.main"
        text={status.toString()}
      />
    );
  }
  if (status === TaskStatus.complete) {
    return (
      <CellItem
        icon={<CheckIcon />}
        color="darkGreen.main"
        text={status.toString()}
      />
    );
  }
  if (status === TaskStatus.todo) {
    return (
      <CellItem
        icon={<NoteIcon />}
        color="solidBlue.main"
        text={status.toString()}
      />
    );
  }
  return <Box>{status}</Box>;
};

export default StatusCell;
