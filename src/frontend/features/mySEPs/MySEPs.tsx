import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import SepFilterBar from '../../components/SepFilterBar/SepFilterBar';
import PageNavigation from '../../components/PageNavigation/PageNavigation';
import SepTableHeader from '../../components/SepTable/SepTableHeader';
import SepTableBody from '../../components/SepTable/SepTableBody';
import { useGetTasksQuery } from '../../services/tasksSlice/tasksSlice';
import { TaskStatus } from '../../../shared/types/Task';

const AllSEPs = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [statusChecked, setStatusChecked] = useState<TaskStatus[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [selectedRow, setSelectedRow] = useState<string[]>([]);

  const { data, isLoading, isError } = useGetTasksQuery({
    limit: rowsPerPage,
    offset: page * rowsPerPage,
    sortBy,
    sortAsc,
    status: statusChecked
      .map((phase: TaskStatus) => phase.toString())
      .join(','),
    search: searchFilter,
  });

  const rows = useMemo(() => {
    if (data) {
      return data.tasks;
    }
    return [];
  }, [data]);

  useEffect(() => {
    // Debounce our search function here so we can wait 500ms for the user to stop typing
    const delayDebounceFn = setTimeout(() => {
      if (searchText.length >= 3) {
        setSearchFilter(searchText);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText, setSearchFilter]);

  return (
    <Box display="flex" flexDirection="column" flexGrow={1} pt="24px">
      <SearchBar
        title="My SEPs"
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <SepFilterBar
        statusChecked={statusChecked}
        setStatusChecked={setStatusChecked}
      />
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexGrow={1}
          py="24px"
        >
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexGrow={1}
          py="24px"
        >
          <Typography color="error.main" fontSize="24px">
            Error
          </Typography>
        </Box>
      ) : (
        <>
          <SepTableHeader rows={rows} resultNumber={data?.count ?? 0} />
          <SepTableBody
            rows={rows}
            count={data?.count ?? 0}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortAsc={sortAsc}
            setSortAsc={setSortAsc}
            selected={selectedRow}
            setSelected={setSelectedRow}
          />
          <PageNavigation
            count={data?.count ?? 0}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default AllSEPs;
