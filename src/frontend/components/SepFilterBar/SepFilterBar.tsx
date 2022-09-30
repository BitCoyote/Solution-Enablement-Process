import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import React from 'react';
import HandWaveIcon from '../../assets/img/Hand-wave.png';
import NoteIcon from '../../assets/img/Note.png';
import CheckIcon from '../../assets/img/Check.png';
import { SEPPhase } from '../../../shared/types/SEP';

interface StatusInterface {
  id: SEPPhase;
  label: string;
  icon: string;
}

const statusLists: StatusInterface[] = [
  {
    id: SEPPhase.complete,
    label: 'Complete',
    icon: CheckIcon,
  },
  {
    id: SEPPhase.design,
    label: 'Design',
    icon: NoteIcon,
  },
  {
    id: SEPPhase.implement,
    label: 'Implement',
    icon: HandWaveIcon,
  },
  {
    id: SEPPhase.initiate,
    label: 'Initiate',
    icon: HandWaveIcon,
  },
  {
    id: SEPPhase.knockout,
    label: 'Knockout',
    icon: '',
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

const SepFilterBar = ({
  statusChecked,
  setStatusChecked,
}: {
  statusChecked: SEPPhase[];
  setStatusChecked: (value: SEPPhase[]) => void;
}) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: SEPPhase | 'all'
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
    let newSelected: SEPPhase[] = [];

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

  const isSelected = (id: SEPPhase) => statusChecked.indexOf(id) !== -1;

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
          ariaLabel={`SEP Status Checkbox ${index}`}
          checked={isSelected(list.id)}
          onChange={(event) => handleChange(event, list.id)}
          label={
            <Box display="flex" alignItems="center" gap="4px">
              {list.icon && <Box component="img" src={list.icon} />}
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

export default SepFilterBar;
