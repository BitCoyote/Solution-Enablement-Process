import { Box, Button, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { TaskSearchRow, TaskStatus } from '../../../shared/types/Task';

interface HeadersInterface {
  key: string;
  label: string;
}

interface DataInterface {
  sepId: number;
  sepName: string;
  tasksName: string;
  assigned: string;
  owedTo: string;
  status: TaskStatus;
  dependentTaskCount: number;
  submitted: string;
}

const headers: HeadersInterface[] = [
  {
    key: 'sepId',
    label: 'SEP#',
  },
  {
    key: 'sepName',
    label: 'SEP Name',
  },
  {
    key: 'tasksName',
    label: 'My Tasks',
  },
  {
    key: 'assigned',
    label: 'Assigned',
  },
  {
    key: 'owedTo',
    label: 'Owed to',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'dependentTaskCount',
    label: 'Dependent Tasks',
  },
  {
    key: 'submitted',
    label: 'Submitted',
  },
];

const SepTableHeader = ({
  rows,
  resultNumber,
}: {
  rows: TaskSearchRow[];
  resultNumber: number;
}) => {
  const [csvData, setCsvData] = useState<DataInterface[]>([]);

  useEffect(() => {
    if (rows.length) {
      const newData: DataInterface[] = [];
      rows.forEach((row: TaskSearchRow) => {
        newData.push({
          sepId: row.sep.id,
          sepName: row.sep.name,
          tasksName: row.name,
          assigned: '',
          owedTo: row.defaultReviewer?.displayName
            ? row.defaultReviewer?.displayName
            : '',
          status: row.status,
          dependentTaskCount: row.dependentTaskCount,
          submitted: '',
        });
      });
      setCsvData(newData);
    }
  }, [rows]);
  return (
    <Box>
      <Divider />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap="8px"
        py="10px"
        sx={{
          px: { xs: '24px', md: '40px' },
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Typography color="darkgray.main" fontSize="14px" fontWeight="600">
          {new Intl.NumberFormat('en-US').format(resultNumber)} Results
        </Typography>
        <Box display="flex" alignItems="center" flexWrap="nowrap">
          <CSVLink
            data={csvData}
            headers={headers}
            filename="seps.csv"
            style={{ textDecoration: 'none' }}
          >
            <Button variant="text" sx={{ py: '4px', textTransform: 'inherit' }}>
              <i className="fa-solid fa-file" style={{ color: "#2372B9" }}></i>
              <Typography
                component="span"
                fontSize="12px"
                fontWeight="600"
                whiteSpace="nowrap"
                ml="4px"
              >
                Export to CSV
              </Typography>
            </Button>
          </CSVLink>
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

export default SepTableHeader;
