import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import SepFilterBar from "../../components/SepFilterBar/SepFilterBar";
import SepSearch from "../../components/SepSearch/SepSearch";
import SepTableHeader from "../../components/SepTable/SepTableHeader";
import SepTableBody from "../../components/SepTable/SepTableBody";
import SepTablePageNavigation from "../../components/SepTable/SepTablePageNavigation";

import { useGetTasksQuery } from "../../services/API/taskAPI";

import {
  TaskSearchResult,
  TaskStatus,
  TaskPhase,
} from "../../../shared/types/Task";
import { DepartmentID } from "../../../shared/types/Department";

const taskSearchResultData: TaskSearchResult = {
  count: 7,
  tasks: [
    {
      id: 1,
      createdAt: "01/01/2021",
      updatedAt: "01/03/2021",
      name: "name",
      phase: TaskPhase.design,
      status: TaskStatus.inReview,
      departmentID: DepartmentID.legal,
      sep: {
        id: 1,
        name: "sepname",
        phase: TaskStatus.inReview,
      },
      dependentTaskCount: 2,
      assignee: { id: "1" },
      reviewer: { id: "1" },
    },
    {
      id: 2,
      createdAt: "04/05/2021",
      updatedAt: "06/03/2021",
      name: "name2",
      phase: TaskPhase.implement,
      status: TaskStatus.complete,
      departmentID: DepartmentID.po,
      sep: {
        id: 2,
        name: "sepname2",
        phase: TaskStatus.todo,
      },
      dependentTaskCount: 2,
      assignee: { id: "2" },
      reviewer: { id: "2" },
    },
    {
      id: 3,
      createdAt: "02/05/2021",
      updatedAt: "06/03/2021",
      name: "name3",
      phase: TaskPhase.implement,
      status: TaskStatus.todo,
      departmentID: DepartmentID.po,
      sep: {
        id: 3,
        name: "sepname3",
        phase: TaskStatus.pending,
      },
      dependentTaskCount: 2,
      assignee: { id: "3" },
      reviewer: { id: "3" },
    },
    {
      id: 4,
      createdAt: "01/01/2021",
      updatedAt: "01/03/2021",
      name: "name4",
      phase: TaskPhase.implement,
      status: TaskStatus.inReview,
      departmentID: DepartmentID.supply,
      sep: {
        id: 4,
        name: "sepname4",
        phase: TaskStatus.complete,
      },
      dependentTaskCount: 2,
      assignee: { id: "4" },
      reviewer: { id: "4" },
    },
    {
      id: 5,
      createdAt: "01/01/2021",
      updatedAt: "01/03/2021",
      name: "name5",
      phase: TaskPhase.implement,
      status: TaskStatus.complete,
      departmentID: DepartmentID.ncs,
      sep: {
        id: 5,
        name: "sepname5",
        phase: TaskStatus.pending,
      },
      dependentTaskCount: 2,
      assignee: { id: "5" },
      reviewer: { id: "5" },
    },
    {
      id: 6,
      createdAt: "01/01/2021",
      updatedAt: "01/03/2021",
      name: "name6",
      phase: TaskPhase.initiate,
      status: TaskStatus.pending,
      departmentID: DepartmentID.sa,
      sep: {
        id: 1,
        name: "sepname6",
        phase: TaskStatus.pending,
      },
      dependentTaskCount: 2,
      assignee: { id: "6" },
      reviewer: { id: "6" },
    },
    {
      id: 7,
      createdAt: "01/01/2021",
      updatedAt: "01/03/2021",
      name: "name7",
      phase: TaskPhase.design,
      status: TaskStatus.pending,
      departmentID: DepartmentID.sec,
      sep: {
        id: 7,
        name: "sepname7",
        phase: TaskStatus.complete,
      },
      dependentTaskCount: 2,
      assignee: { id: "7" },
      reviewer: { id: "7" },
    },
  ],
};

const AllSEPs = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [statusChecked, setStatusChecked] = useState<TaskStatus[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);

  const { data, isLoading, isError } = useGetTasksQuery({
    limit: rowsPerPage,
    offset: page * rowsPerPage,
    sortBy,
    sortAsc,
    search: searchText.length < 3 ? "" : searchText,
  });
  console.log(data);

  const rows = useMemo(() => {
    if (statusChecked.length === 0) return taskSearchResultData.tasks;
    return taskSearchResultData.tasks.filter((task) =>
      statusChecked.includes(task.sep.phase)
    );
  }, [statusChecked]);

  return (
    <Box display="flex" flexDirection="column" flexGrow={1} pt="24px">
      <SepSearch
        title="All SEPs"
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
          <SepTableHeader
            rows={rows}
            resultNumber={rows.length}
            closedNumber={197}
            showEditColumnsButton={true}
          />
          <SepTableBody
            rows={rows}
            count={rows.length}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortAsc={sortAsc}
            setSortAsc={setSortAsc}
          />
          <SepTablePageNavigation
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

export default AllSEPs;
