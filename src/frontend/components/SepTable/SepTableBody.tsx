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

import SepDocIcon from '../../assets/img/sepdoc.png';
import PlusIcon from '../../assets/img/plus.png';
import { SEPSearchRow } from '../../../shared/types/SEP';

export interface HeadCell {
  id: string;
  key: string;
  label: string;
}

export const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    key: 'id',
    label: 'SEP#',
  },
  {
    id: 'name',
    key: 'name',
    label: 'SEP Name',
  },
  {
    id: 'description',
    key: 'description',
    label: 'Description',
  },
  {
    id: 'phase',
    key: 'phase',
    label: 'Phase',
  },
  {
    id: 'createdBy',
    key: 'createdBy',
    label: 'Created By',
  },
  {
    id: 'creatorId',
    key: 'creator.id',
    label: 'Creator Id',
  },
  {
    id: 'createdAt',
    key: 'createdAt',
    label: 'CreatedAt',
  },
  {
    id: 'updatedAt',
    key: 'updatedAt',
    label: 'UpdatedAt',
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
      <Box display="flex" alignItems="center" mb="20px">
        <Box
          component="img"
          src={isHover ? PlusIcon : SepDocIcon}
          alt=""
          width={24}
          mr="8px"
          sx={{ cursor: 'pointer' }}
          onMouseOver={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        />
        <Typography color="solidGrey.main" fontSize="18px">
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
  rows: SEPSearchRow[];
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
              {rows.map((row: SEPSearchRow) => {
                const isItemSelected = isSelected(row.name);

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    aria-label={`SEPs Row ${row.name}`}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isItemSelected} />
                    </TableCell>
                    <TableCell aria-label="SEP Id">{row.id}</TableCell>
                    <TableCell aria-label="SEP Name">{row.name}</TableCell>
                    <TableCell aria-label="SEP Description">
                      {row.description}
                    </TableCell>
                    <TableCell aria-label="SEP Phase">{row.phase}</TableCell>
                    <TableCell aria-label="Create By">
                      {row.createdBy}
                    </TableCell>
                    <TableCell aria-label="Creator Id">
                      {row.creator.id}
                    </TableCell>
                    <TableCell aria-label="SEP CreatedAt">
                      {row.createdAt}
                    </TableCell>
                    <TableCell aria-label="SEP UpdatedAt">
                      {row.updatedAt}
                    </TableCell>
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
