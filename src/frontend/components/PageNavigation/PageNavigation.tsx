import React, { Fragment, useMemo } from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const rowsPerPageOptions: number[] = [5, 10, 25];

const PageNavigation = ({
  count,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
}: {
  count: number;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (row: number) => void;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const lastPage = useMemo(
    () => Math.floor((count - 1) / rowsPerPage),
    [rowsPerPage, count]
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (newPage: number) => {
    if (newPage < 0 || newPage > lastPage) return;
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (option: number) => {
    setRowsPerPage(option);
    setPage(0);
    handleClose();
  };

  const PageButton = (value: number) => {
    return (
      <Button
        variant="text"
        size="small"
        sx={{
          minWidth: '24px',
          fontWeight: page === value ? '600' : '400',
        }}
        onClick={() => handleChangePage(value)}
      >
        {value + 1}
      </Button>
    );
  };

  const PageBox = () => {
    if (count <= rowsPerPage * 6) {
      return (
        <>
          {Array.from(Array(lastPage + 1))
            .map((_, index) => index)
            .map((value) => (
              <Fragment key={value.toString()}>{PageButton(value)}</Fragment>
            ))}
        </>
      );
    }

    if (page <= 2) {
      return (
        <Box display="flex" alignItems="center">
          {Array.from(Array(page + 2))
            .map((_, index) => index)
            .map((value) => (
              <Fragment key={value.toString()}>{PageButton(value)}</Fragment>
            ))}
          <Typography color="primary.main">...</Typography>
          {PageButton(lastPage)}
        </Box>
      );
    } else if (page >= lastPage - 2) {
      return (
        <Box display="flex" alignItems="center">
          {PageButton(0)}
          <Typography color="primary.main">...</Typography>
          {Array.from(Array(lastPage - page + 2))
            .map((_, index) => index + page - 1)
            .map((value) => (
              <Fragment key={value.toString()}>{PageButton(value)}</Fragment>
            ))}
        </Box>
      );
    } else {
      return (
        <Box display="flex" alignItems="center">
          {PageButton(0)}
          <Typography color="primary.main">...</Typography>
          {Array.from(Array(3))
            .map((_, index) => index + page - 1)
            .map((value) => (
              <Fragment key={value.toString()}>{PageButton(value)}</Fragment>
            ))}
          <Typography color="primary.main">...</Typography>
          {PageButton(lastPage)}
        </Box>
      );
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
      py="16px"
      gap="16px"
      px="40px"
      sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
    >
      {count ? (
        <Box display="flex" alignItems="center">
          <Button
            variant="text"
            size="small"
            aria-label="Prev Page Button"
            onClick={() => handleChangePage(page - 1)}
          >
            <KeyboardArrowLeftIcon />
            <Typography component="span" fontSize="12px" fontWeight="600">
              Prev
            </Typography>
          </Button>
          <Box px="4px">{PageBox()}</Box>
          <Button
            variant="text"
            size="small"
            aria-label="Next Page Button"
            onClick={() => handleChangePage(page + 1)}
          >
            <Typography component="span" fontSize="12px" fontWeight="600">
              Next
            </Typography>
            <KeyboardArrowRightIcon />
          </Button>
        </Box>
      ) : null}
      <Box
        display="flex"
        alignItems="center"
        sx={{
          position: { xs: 'relative', md: 'absolute' },
          right: { xs: '0', md: '40px' },
        }}
      >
        <Typography color="darkgray.main" fontSize="12px" mr="4px">
          Items per Page
        </Typography>
        <Button
          variant="text"
          aria-label="Rows Per Page Dropdown Button"
          onClick={handleClick}
          size="small"
        >
          {rowsPerPage} {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {rowsPerPageOptions.map((option) => (
            <MenuItem
              key={option.toString()}
              aria-label={`Rows Per Page Option ${option}`}
              onClick={() => handleChangeRowsPerPage(option)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default PageNavigation;
