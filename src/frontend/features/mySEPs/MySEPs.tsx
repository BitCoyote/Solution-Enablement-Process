import { Box, Card, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import SepFilterBar from "../../components/SepFilterBar/SepFilterBar";
import SepSearch from "../../components/SepSearch/SepSearch";
import SepTableHeader from "../../components/SepTable/SepTableHeader";
import SepTableBody from "../../components/SepTable/SepTableBody";
import SepTablePageNavigation from "../../components/SepTable/SepTablePageNavigation";
import { TableData } from "../../components/SepTable/SepTableBody";

const rows: TableData[] = [];

const MySEPs = () => {
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

export default MySEPs;
