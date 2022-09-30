import React from 'react';
import { Box, TextField, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({
  title,
  searchText,
  setSearchText,
}: {
  title: string;
  searchText: string;
  setSearchText: (text: string) => void;
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap="8px"
      mb="20px"
      sx={{
        px: { xs: '24px', md: '40px' },
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Typography color="darkgray.main" fontSize="25px" fontWeight="600">
        {title}
      </Typography>
      <TextField
        placeholder="Search for an SEP, Initiative name, requestor, and more…"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        aria-label="Search TextField"
        value={searchText}
        onChange={handleChange}
        sx={{
          width: '100%',
          maxWidth: '450px',
          '& .MuiOutlinedInput-root': {
            paddingLeft: '8px',
            '& input': {
              padding: '5px 14px 5px 0',
              '&::placeholder': {
                fontSize: '14px',
                opacity: 1,
                color: (theme) => theme.palette.solidGrey.main,
              },
            },
            '& fieldset': {
              borderColor: (theme) => theme.palette.solidGrey.main,
            },
            '&:hover fieldset': {
              borderColor: (theme) => theme.palette.solidBlue.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: (theme) => theme.palette.solidBlue.main,
            },
          },
        }}
      />
      <Box />
    </Box>
  );
};

export default SearchBar;
