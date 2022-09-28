import { Box, Card, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import SepFilterBar from "../../components/SepFilterBar/SepFilterBar";
import SepSearch from "../../components/SepSearch/SepSearch";
import SepTableHeader from "../../components/SepTable/SepTableHeader";
import SepTableBody from "../../components/SepTable/SepTableBody";
import SepTablePageNavigation from "../../components/SepTable/SepTablePageNavigation";
import { TableData } from "../../components/SepTable/SepTableBody";

function createData(
  tasks: string,
  assigned: string,
  owedTo: string,
  status: string,
  dependentTasks: number,
  submittedDate: string,
  id: number,
  name: string
): TableData {
  return {
    id,
    name,
    tasks,
    assigned,
    owedTo,
    status,
    dependentTasks,
    submittedDate,
  };
}

const rows: TableData[] = [
  createData(
    "Please update APM <APM ID> <APM App Name> data classification and regulatory information.",
    "mm/dd/yyyy",
    "<Resource Owner,Resource>",
    "To-Do",
    3,
    "mm/dd/yyyy",
    101,
    "SFMS Replacement1"
  ),
  createData(
    "Please update APM <APM ID> <APM App Name> data classification and regulatory information.",
    "mm/dd/yyyy",
    "<Resource Owner,Resource>",
    "To-Do",
    3,
    "mm/dd/yyyy",
    102,
    "SFMS Replacement2"
  ),
  createData(
    "Please update APM <APM ID> <APM App Name> data classification and regulatory information.",
    "mm/dd/yyyy",
    "<Resource Owner,Resource>",
    "To-Do",
    3,
    "mm/dd/yyyy",
    103,
    "SFMS Replacement3"
  ),
  createData(
    "Please update APM <APM ID> <APM App Name> data classification and regulatory information.",
    "mm/dd/yyyy",
    "<Resource Owner,Resource>",
    "To-Do",
    3,
    "mm/dd/yyyy",
    104,
    "SFMS Replacement4"
  ),
  createData(
    "Please update APM <APM ID> <APM App Name> data classification and regulatory information.",
    "mm/dd/yyyy",
    "<Resource Owner,Resource>",
    "To-Do",
    3,
    "mm/dd/yyyy",
    105,
    "SFMS Replacement5"
  ),
  createData(
    "Please update APM <APM ID> <APM App Name> data classification and regulatory information.",
    "mm/dd/yyyy",
    "<Resource Owner,Resource>",
    "To-Do",
    3,
    "mm/dd/yyyy",
    106,
    "SFMS Replacement6"
  ),
  createData(
    "Please update APM <APM ID> <APM App Name> data classification and regulatory information.",
    "mm/dd/yyyy",
    "<Resource Owner,Resource>",
    "To-Do",
    3,
    "mm/dd/yyyy",
    107,
    "SFMS Replacement7"
  ),
  createData(
    "Please update APM <APM ID> <APM App Name> data classification and regulatory information.",
    "mm/dd/yyyy",
    "<Resource Owner,Resource>",
    "To-Do",
    3,
    "mm/dd/yyyy",
    108,
    "SFMS Replacement8"
  ),
  createData(
    "Please update APM <APM ID> <APM App Name> data classification and regulatory information.",
    "mm/dd/yyyy",
    "<Resource Owner,Resource>",
    "To-Do",
    3,
    "mm/dd/yyyy",
    109,
    "SFMS Replacement9"
  ),
  createData(
    "Please update APM <APM ID> <APM App Name> data classification and regulatory information.",
    "mm/dd/yyyy",
    "<Resource Owner,Resource>",
    "To-Do",
    3,
    "mm/dd/yyyy",
    110,
    "SFMS Replacement10"
  ),
];

const AllSEPs = () => {
  const [loading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [statusChecked, setStatusChecked] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  useEffect(() => {
    if (searchText.length < 3) return;
  }, [searchText]);

  return (
    <Card>
      <Box pt="24px">
        <SepSearch
          title="All SEPs"
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <SepFilterBar
          statusChecked={statusChecked}
          setStatusChecked={setStatusChecked}
        />
        {loading ? (
          <Box display="flex" justifyContent="center" py="24px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <SepTableHeader
              rows={rows}
              resultNumber={1374}
              closedNumber={197}
              showEditColumnsButton={true}
            />
            <SepTableBody rows={rows} page={page} rowsPerPage={rowsPerPage} />
            <SepTablePageNavigation
              itemLength={rows.length}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
            />
          </>
        )}
      </Box>
    </Card>
  );
};

export default AllSEPs;
