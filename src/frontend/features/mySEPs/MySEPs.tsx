import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import SepFilterBar from "../../components/SepFilterBar/SepFilterBar";
import PageNavigation from "../../components/PageNavigation/PageNavigation";
import SepTableHeader from "../../components/SepTable/SepTableHeader";
import SepTableBody from "../../components/SepTable/SepTableBody";
import { useGetSepsQuery } from "../../services/API/sepAPI";
import { SEPSearchResult, SEPPhase } from "../../../shared/types/SEP";

const MySEPs = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [statusChecked, setStatusChecked] = useState<SEPPhase[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [selectedRow, setSelectedRow] = useState<string[]>([]);

  const { data, isLoading, isError } = useGetSepsQuery({
    limit: rowsPerPage,
    offset: page * rowsPerPage,
    sortBy,
    sortAsc,
    search: searchText.length < 3 ? "" : searchText,
  });

  const rows = useMemo(() => {
    if (data) {
      if (statusChecked.length === 0) return data.seps;
      return data.seps.filter((sep) =>
        statusChecked.includes(sep.phase)
      );
    }
    return []
  }, [statusChecked]);

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
          <SepTableHeader
            rows={rows}
            resultNumber={rows.length}
            showEditColumnsButton={true}
          />
          <SepTableBody
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

export default MySEPs;
