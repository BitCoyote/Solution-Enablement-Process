import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import StatusCell from './StatusCell';
import { TaskSearchRow } from '../../../shared/types/Task';

export interface HeadCell {
  id: string;
  key: string;
  label: string;
}

export const headCells: readonly HeadCell[] = [
  {
    id: 'sepId',
    key: 'sep.id',
    label: 'SEP#',
  },
  {
    id: 'sepName',
    key: 'sep.name',
    label: 'SEP Name',
  },
  {
    id: 'tasksName',
    key: 'name',
    label: 'My Tasks',
  },
  {
    id: 'assigned',
    key: '',
    label: 'Assigned',
  },
  {
    id: 'owedTo',
    key: 'reviewer.displayName',
    label: 'Owed to',
  },
  {
    id: 'status',
    key: 'status',
    label: 'Status',
  },
  {
    id: 'dependentTaskCount',
    key: 'dependentTaskCount',
    label: 'Dependent Tasks',
  },
  {
    id: 'submitted',
    key: '',
    label: 'Submitted',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortAsc: boolean;
  sortBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    numSelected,
    rowCount,
    sortAsc,
    sortBy,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'Select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="normal"
            sortDirection={sortBy === headCell.key && sortAsc ? 'asc' : false}
          >
            <TableSortLabel
              active={sortBy === headCell.key}
              direction={sortBy === headCell.key && sortAsc ? 'asc' : 'desc'}
              aria-label={`Table Sort Label ${headCell.key}`}
              onClick={createSortHandler(headCell.key)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function NoSEP() {
  const [isHover, setIsHover] = useState<boolean>(false);
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      py="36px"
    >
      <Box
        display="flex"
        alignItems="center"
        mb="20px"
        sx={{ cursor: 'pointer' }}
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {isHover ? (
          <i
            className="fa-solid fa-plus"
            style={{ color: '#2372B9', width: '16px', fontSize: '18px' }}
          ></i>
        ) : (
          <i
            className="fa-solid fa-file-magnifying-glass"
            style={{ color: '#7e8083', width: '16px', fontSize: '18px' }}
          ></i>
        )}
        <Typography color="solidGrey.main" fontSize="18px" ml="8px">
          Don’t have any SEPs
        </Typography>
      </Box>
      <Typography
        color="solidGrey.main"
        fontSize="12px"
        maxWidth="240px"
        textAlign="center"
      >
        Choose{' '}
        <Typography
          component="span"
          color="solidGrey.main"
          fontSize="12px"
          fontWeight="600"
        >
          Create an SEP
        </Typography>{' '}
        from the navigation options to begin creating and SEP
      </Typography>
    </Box>
  );
}

const SepTableBody = ({
  rows,
  count,
  sortBy,
  setSortBy,
  sortAsc,
  setSortAsc,
  selected,
  setSelected,
}: {
  rows: TaskSearchRow[];
  count: number;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortAsc: boolean;
  setSortAsc: (sortAsc: boolean) => void;
  selected: string[];
  setSelected: (value: string[]) => void;
}) => {
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = sortBy === property && sortAsc;
    setSortAsc(!isAsc);
    setSortBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  return (
    <Box sx={{ width: '100%' }}>
      {count ? (
        <TableContainer
          sx={{
            // width: 400,
            // height: 400,
            /* width */
            '&::-webkit-scrollbar': {
              width: '10px',
              height: '10px',
            },
            /* Track */
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            /* Handle */
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '10px',
              /* Handle on hover */
              '&:hover': {
                background: '#555',
              },
            },
          }}
        >
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              sortAsc={sortAsc}
              sortBy={sortBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={count}
            />
            <TableBody>
              {rows.map((row: TaskSearchRow) => {
                const isItemSelected = isSelected(row.name);

                return (
                  <TableRow
                    hover
                    onClick={(event: any) => handleClick(event, row.name)}
                    aria-label={`SEPs Row ${row.name}`}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isItemSelected} />
                    </TableCell>
                    <TableCell aria-label="SEP Id">{row.sep.id}</TableCell>
                    <TableCell aria-label="SEP Name">{row.sep.name}</TableCell>
                    <TableCell aria-label="Tasks Name">{row.name}</TableCell>
                    <TableCell aria-label="Assigned"></TableCell>
                    <TableCell aria-label="Owed To">
                      {row.defaultReviewer?.displayName}
                    </TableCell>
                    <TableCell aria-label="Tasks Status">
                      <StatusCell status={row.status} />
                    </TableCell>
                    <TableCell aria-label="Tasks DependentTaskCount">
                      {row.dependentTaskCount}
                    </TableCell>
                    <TableCell aria-label="Submitted"></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <NoSEP />
      )}
    </Box>
  );
};

export default SepTableBody;
