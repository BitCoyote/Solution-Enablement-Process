import { Box, Button, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import FileIcon from '../../assets/img/File.png';
import {
  TaskSearchRow,
  TaskStatus,
  TaskPhase,
} from '../../../shared/types/Task';
import { DepartmentID } from '../../../shared/types/Department';

interface HeadersInterface {
  key: string;
  label: string;
}

interface DataInterface {
  id: number;
  name: string;
  phase: TaskStatus;
  tasksId: number;
  tasksName: string;
  createdAt: string;
  updatedAt: string;
  tasksPhase: TaskPhase;
  tasksStatus: TaskStatus;
  departmentID: DepartmentID;
  dependentTaskCount: number;
  assigneeId: string;
  assigneeEmail?: string;
  assigneeDisplayName?: string;
  reviewerId: string;
  reviewerEmail?: string;
  reviewerDisplayName?: string;
}

const headers: HeadersInterface[] = [
  {
    key: 'id',
    label: 'SEP#',
  },
  {
    key: 'name',
    label: 'SEP Name',
  },
  {
    key: 'phase',
    label: 'SEP Phase',
  },
  {
    key: 'tasksId',
    label: 'Tasks Id',
  },
  {
    key: 'tasksName',
    label: 'Tasks Name',
  },
  {
    key: 'tasksPhase',
    label: 'Tasks Phase',
  },
  {
    key: 'tasksStatus',
    label: 'Tasks Status',
  },
  {
    key: 'departmentID',
    label: 'Department ID',
  },
  {
    key: 'dependentTaskCount',
    label: 'Dependent Task Count',
  },
  {
    key: 'assigneeId',
    label: 'Assignee Id',
  },
  {
    key: 'assigneeEmail',
    label: 'Assignee Email',
  },
  {
    key: 'assigneeDisplayName',
    label: 'Assignee Display Name',
  },
  {
    key: 'reviewerId',
    label: 'Reviewer Id',
  },
  {
    key: 'reviewerEmail',
    label: 'Reviewer Email',
  },
  {
    key: 'reviewerDisplayName',
    label: 'Reviewer Display Name',
  },
  {
    key: 'createdAt',
    label: 'CreatedAt',
  },
  {
    key: 'updatedAt',
    label: 'UpdatedAt',
  },
];

const TasksTableHeader = ({
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
          id: row.sep.id,
          name: row.sep.name,
          phase: row.sep.phase,
          tasksId: row.id,
          tasksName: row.name,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          tasksPhase: row.phase,
          tasksStatus: row.status,
          departmentID: row.departmentID,
          dependentTaskCount: row.dependentTaskCount,
          assigneeId: row.assignee.id,
          assigneeEmail: row.assignee?.email,
          assigneeDisplayName: row.assignee?.displayName,
          reviewerId: row.reviewer.id,
          reviewerEmail: row.reviewer?.email,
          reviewerDisplayName: row.reviewer?.displayName,
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
            filename="tasks.csv"
            style={{ textDecoration: 'none' }}
          >
            <Button variant="text" sx={{ py: '4px', textTransform: 'inherit' }}>
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
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

export default TasksTableHeader;
