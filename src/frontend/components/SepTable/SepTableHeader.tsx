import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import { CSVLink } from "react-csv";
import { TableData } from "../../components/SepTable/SepTableBody";
import FileIcon from "../../assets/img/File.png";
import TableIcon from "../../assets/img/Table.png";

const headers = [
  {
    key: "id",
    label: "SEP#",
  },
  {
    key: "name",
    label: "SEP Name",
  },
  {
    key: "tasks",
    label: "My Tasks",
  },
  {
    key: "assigned",
    label: "Assigned",
  },
  {
    key: "owedTo",
    label: "Owed to",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "dependentTasks",
    label: "Dependent Tasks",
  },
  {
    key: "submittedDate",
    label: "Submitted",
  },
];

const SepTableHeader = ({
  rows,
  resultNumber,
  closedNumber,
  showEditColumnsButton,
}: {
  rows: TableData[];
  resultNumber: number;
  closedNumber: number;
  showEditColumnsButton: boolean;
}) => {
  return (
    <>
      <Divider />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap="8px"
        py="10px"
        sx={{
          px: { xs: "24px", md: "40px" },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Typography>
          <Typography
            component="span"
            color="darkgray.main"
            fontSize="14px"
            fontWeight="600"
          >
            {new Intl.NumberFormat("en-US").format(resultNumber)} Results for
          </Typography>{" "}
          <Typography
            component="span"
            color="mediumGrey.main"
            fontSize="14px"
            fontWeight="600"
          >
            Generation Submitted Closed{" "}
            {new Intl.NumberFormat("en-US").format(closedNumber)}
          </Typography>
        </Typography>
        <Box display="flex" alignItems="center" flexWrap="nowrap">
          <CSVLink
            data={rows}
            headers={headers}
            filename="sep.csv"
            style={{ textDecoration: "none" }}
          >
            <Button variant="text" sx={{ py: "4px", textTransform: "inherit" }}>
              <Box component="img" src={FileIcon} mr="4px" />
              <Typography
                component="span"
                fontSize="12px"
                fontWeight="600"
                whiteSpace="nowrap"
              >
                Export to CSV
              </Typography>
            </Button>
          </CSVLink>
          {showEditColumnsButton && (
            <Button variant="text" sx={{ py: "4px", textTransform: "inherit" }}>
              <Box component="img" src={TableIcon} mr="4px" />
              <Typography
                component="span"
                fontSize="12px"
                fontWeight="600"
                whiteSpace="nowrap"
              >
                Edit Columns
              </Typography>
            </Button>
          )}
        </Box>
      </Box>
      <Divider />
    </>
  );
};

export default SepTableHeader;
