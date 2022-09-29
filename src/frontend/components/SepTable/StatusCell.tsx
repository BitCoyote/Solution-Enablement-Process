import { Box, Typography } from "@mui/material";
import React from "react";
import { TaskStatus } from "../../../shared/types/Task";
import HandWaveIcon from "../../assets/img/Hand-wave.png";
import NoteIcon from "../../assets/img/Note.png";
import CheckIcon from "../../assets/img/Check.png";

const CellItem = ({
  icon,
  text,
  color,
}: {
  icon: string;
  text: string;
  color: string;
}) => (
  <Box display="flex" alignItems="center">
    <Box
      component="img"
      width="14px"
      minWidth="14px"
      mr="8px"
      src={icon}
      alt=""
    />
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
        icon={HandWaveIcon}
        color="solidOrange.main"
        text={status.toString()}
      />
    );
  }
  if (status === TaskStatus.complete) {
    return (
      <CellItem
        icon={CheckIcon}
        color="darkGreen.main"
        text={status.toString()}
      />
    );
  }
  if (status === TaskStatus.todo) {
    return (
      <CellItem
        icon={NoteIcon}
        color="solidBlue.main"
        text={status.toString()}
      />
    );
  }
  return <Box>{status}</Box>;
};

export default StatusCell;
