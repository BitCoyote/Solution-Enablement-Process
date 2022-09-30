import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import TasksFilterBar from '../../components/TasksFilterBar/TasksFilterBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import TasksTableHeader from '../../components/TasksTable/TasksTableHeader';
import TasksTableBody from '../../components/TasksTable/TasksTableBody';
import PageNavigation from '../../components/PageNavigation/PageNavigation';
import { useGetTasksQuery } from '../../services/tasksSlice/tasksSlice';
import { TaskStatus } from '../../../shared/types/Task';

const AllTasks = () => {
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
    search: searchFilter,
  });

  const rows = useMemo(() => {
    if (data) {
      if (statusChecked.length === 0) return data.tasks;
      return data.tasks.filter((task) =>
        statusChecked.includes(task.sep.phase)
      );
    }
    return [];
  }, [statusChecked, data]);

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
        title="All Tasks"
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <TasksFilterBar
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
          <TasksTableHeader rows={rows} resultNumber={rows.length} />
          <TasksTableBody
            rows={rows}
            count={rows.length}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortAsc={sortAsc}
            setSortAsc={setSortAsc}
            selected={selectedRow}
            setSelected={setSelectedRow}
          />
          <PageNavigation
            count={rows.length}
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

export default AllTasks;
