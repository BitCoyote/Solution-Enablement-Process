import { Box, Button, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import FileIcon from '../../assets/img/File.png';
import { SEPSearchRow, SEPPhase } from '../../../shared/types/SEP';

interface HeadersInterface {
  key: string;
  label: string;
}

interface DataInterface {
  id: number;
  name: string;
  description?: string;
  createdBy: string;
  phase: SEPPhase;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
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
    key: 'description',
    label: 'Description',
  },
  {
    key: 'phase',
    label: 'SEP Phase',
  },
  {
    key: 'createdBy',
    label: 'Created By',
  },
  {
    key: 'creatorId',
    label: 'Creator Id',
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

const SepTableHeader = ({
  rows,
  resultNumber,
}: {
  rows: SEPSearchRow[];
  resultNumber: number;
}) => {
  const [csvData, setCsvData] = useState<DataInterface[]>([]);

  useEffect(() => {
    if (rows.length) {
      const newData: DataInterface[] = [];
      rows.forEach((row: SEPSearchRow) => {
        newData.push({
          id: row.id,
          name: row.name,
          description: row.description,
          phase: row.phase,
          createdBy: row.createdBy,
          creatorId: row.creator.id,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
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

export default SepTableHeader;
