import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import React, { useMemo } from "react";
import HandWaveIcon from "../../assets/img/Hand-wave.png";
import NoteIcon from "../../assets/img/Note.png";
import CheckIcon from "../../assets/img/Check.png";

const statusLists = [
  {
    label: "To-Do",
    icon: NoteIcon,
  },
  {
    label: "Needs Review",
    icon: HandWaveIcon,
  },
  {
    label: "Changes Requested",
    icon: HandWaveIcon,
  },
  {
    label: "Complete",
    icon: CheckIcon,
  },
];

const StyledCheckBox = ({
  indeterminate = false,
  checked,
  onChange,
  label,
}: {
  indeterminate: boolean;
  checked: boolean;
  onChange: () => void;
  label: JSX.Element;
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          indeterminate={indeterminate}
          sx={{ p: 0.5 }}
          checked={checked}
          onChange={onChange}
        />
      }
      label={label}
      sx={{ mr: 0 }}
    />
  );
};

const SepFilterBar = ({
  statusChecked,
  setStatusChecked,
}: {
  statusChecked: boolean[];
  setStatusChecked: (value: boolean[]) => void;
}) => {
  const allChecked = useMemo(() => {
    return (
      statusChecked[0] &&
      statusChecked[1] &&
      statusChecked[2] &&
      statusChecked[3]
    );
  }, [statusChecked]);

  const handleChange = (index: number | "all") => {
    if (index === "all") {
      setStatusChecked([!allChecked, !allChecked, !allChecked, !allChecked]);
      return;
    }
    setStatusChecked([
      ...statusChecked.slice(0, index),
      !statusChecked[index],
      ...statusChecked.slice(index + 1, statusChecked.length),
    ]);
  };
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      alignItems="center"
      gap="16px"
      px="16px"
      mb="16px"
    >
      <Typography fontSize="12px" color="darkgray.main">
        View by Status
      </Typography>
      <StyledCheckBox
        indeterminate={
          !allChecked &&
          (statusChecked[0] ||
            statusChecked[1] ||
            statusChecked[2] ||
            statusChecked[3])
        }
        checked={allChecked}
        onChange={() => handleChange("all")}
        label={
          <Box>
            <Typography fontSize="12px" color="darkgray.main">
              All Statuses
            </Typography>
          </Box>
        }
      />
      {statusLists.map((list, index) => (
        <StyledCheckBox key={list.label} indeterminate={false} checked={statusChecked[index]}
              onChange={() => handleChange(index)} label={
            <Box display="flex" alignItems="center" gap="4px">
              <Box component="img" src={list.icon} />
              <Typography fontSize="12px" color="darkgray.main">
                {list.label}
              </Typography>
            </Box>
          } />
      ))}
    </Box>
  );
};

export default SepFilterBar;
