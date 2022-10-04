import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import React from 'react';
import { TaskStatus } from '../../../shared/types/Task';

interface StatusInterface {
  id: TaskStatus;
  label: string;
  icon: React.ReactNode | null;
}

const statusLists: StatusInterface[] = [
  {
    id: TaskStatus.pending,
    label: 'Pending',
    icon: null,
  },
  {
    id: TaskStatus.todo,
    label: 'To-Do',
    icon: <i className="fa-solid fa-note-sticky" style={{ color: "#2372B9" }}></i>,
  },
  {
    id: TaskStatus.inReview,
    label: 'Needs Review',
    icon: <i className="fa-solid fa-hand-wave" style={{ color: "#F47B27" }}></i>,
  },
  {
    id: TaskStatus.changesRequested,
    label: 'Changes Requested',
    icon: <i className="fa-solid fa-hand-wave" style={{ color: "#F47B27" }}></i>,
  },
  {
    id: TaskStatus.complete,
    label: 'Complete',
    icon: <i className="fa-solid fa-check" style={{ color: "#6BA543" }}></i>,
  },
];

const StyledCheckBox = ({
  indeterminate = false,
  checked,
  onChange,
  ariaLabel,
  label,
}: {
  indeterminate: boolean;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel: string;
  label: JSX.Element;
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          indeterminate={indeterminate}
          sx={{ p: 0.5 }}
          aria-label={ariaLabel}
          checked={checked}
          onChange={onChange}
        />
      }
      label={label}
      sx={{ mr: 0 }}
    />
  );
};

const TasksFilterBar = ({
  statusChecked,
  setStatusChecked,
}: {
  statusChecked: TaskStatus[];
  setStatusChecked: (value: TaskStatus[]) => void;
}) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: TaskStatus | 'all'
  ) => {
    if (id === 'all') {
      if (event.target.checked) {
        const newSelected = statusLists.map((n) => n.id);
        setStatusChecked(newSelected);
      } else {
        setStatusChecked([]);
      }
      return;
    }
    const selectedIndex = statusChecked.indexOf(id);
    let newSelected: TaskStatus[] = [];

    if (selectedIndex < 0) {
      newSelected = newSelected.concat(statusChecked, id);
    } else {
      newSelected = newSelected.concat(
        statusChecked.slice(0, selectedIndex),
        statusChecked.slice(selectedIndex + 1)
      );
    }
    setStatusChecked(newSelected);
  };

  const isSelected = (id: TaskStatus) => statusChecked.indexOf(id) !== -1;

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
          statusChecked.length > 0 && statusChecked.length < statusLists.length
        }
        checked={
          statusLists.length > 0 && statusChecked.length === statusLists.length
        }
        onChange={(event) => handleChange(event, 'all')}
        ariaLabel="Select All Statues"
        label={
          <Box>
            <Typography fontSize="12px" color="darkgray.main">
              All Statuses
            </Typography>
          </Box>
        }
      />
      {statusLists.map((list: StatusInterface, index: number) => (
        <StyledCheckBox
          key={list.label}
          indeterminate={false}
          ariaLabel={`Status Checkbox ${index}`}
          checked={isSelected(list.id)}
          onChange={(event) => handleChange(event, list.id)}
          label={
            <Box display="flex" alignItems="center" gap="4px">
              {list.icon}
              <Typography fontSize="12px" color="darkgray.main">
                {list.label}
              </Typography>
            </Box>
          }
        />
      ))}
    </Box>
  );
};

export default TasksFilterBar;
