import { Box, Button, Divider, Typography } from '@mui/material';
import React, { useState } from 'react';
import { CSVDownload } from 'react-csv';
import { useGetTasksQuery } from '../../services/tasksSlice/tasksSlice';
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

const CsvExport = ({
  count,
  sortBy,
  sortAsc,
  status,
  searchFilter,
  assigneeId,
  setIsCsv,
}: {
  count: number;
  sortBy?: string;
  sortAsc?: boolean;
  status?: string;
  searchFilter?: string;
  assigneeId?: string;
  setIsCsv: (val: boolean) => void;
}) => {
  const { data } = useGetTasksQuery({
    limit: count,
    sortBy,
    sortAsc,
    status,
    assigneeId,
    search: searchFilter,
  });
  const csvData: DataInterface[] | undefined = data?.tasks.map(
    (row: TaskSearchRow) => {
      return {
        sepId: row.sep.id,
        sepName: row.sep.name,
        tasksName: row.name,
        assigned: '',
        owedTo: row.defaultReviewer?.displayName ?? '',
        status: row.status,
        dependentTaskCount: row.dependentTaskCount,
        submitted: '',
      };
    }
  );
  setIsCsv(!csvData);

  return csvData ? (
    <CSVDownload data={csvData} headers={headers} target="_blank" />
  ) : null;
};

const SepTableHeader = ({
  count,
  sortBy,
  sortAsc,
  status,
  searchFilter,
  resultNumber,
  assigneeId,
}: {
  count: number;
  sortBy?: string;
  sortAsc?: boolean;
  status?: string;
  searchFilter?: string;
  resultNumber: number;
  assigneeId?: string;
}) => {
  const [isCsv, setIsCsv] = useState<boolean>(false);

  const handleDownload = () => {
    setIsCsv(true);
  };

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
          <Button
            variant="text"
            sx={{ py: '4px', textTransform: 'inherit' }}
            onClick={handleDownload}
          >
            <i className="fa-solid fa-file" style={{ color: '#2372B9' }}></i>
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
          {isCsv && (
            <CsvExport
              count={count}
              sortBy={sortBy}
              sortAsc={sortAsc}
              status={status}
              searchFilter={searchFilter}
              assigneeId={assigneeId}
              setIsCsv={setIsCsv}
            />
          )}
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

export default SepTableHeader;
