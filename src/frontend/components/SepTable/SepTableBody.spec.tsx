import React from 'react';
import { renderWithProviders } from '../../../../testing/test-utils';
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import SepTableBody, { HeadCell } from './SepTableBody';
import {
  TaskSearchResult,
  TaskStatus,
  TaskPhase,
} from '../../../shared/types/Task';
import { DepartmentID } from '../../../shared/types/Department';

const rows: TaskSearchResult = {
  count: 1,
  tasks: [
    {
      id: 1,
      createdAt: '01/01/2021',
      updatedAt: '01/03/2021',
      name: 'name',
      phase: TaskPhase.design,
      status: TaskStatus.inReview,
      departmentID: DepartmentID.legal,
      sep: {
        id: 1,
        name: 'sepname',
        phase: TaskStatus.inReview,
      },
      dependentTaskCount: 2,
      assignee: { id: '1' },
      reviewer: { id: '1' },
    },
  ],
};

export const headCells: readonly HeadCell[] = [
  {
    id: 'sepId',
    key: 'sep.id',
    label: 'SEP#',
  },
  {
    id: 'sepName',
    key: 'sep.name',
    label: 'SEP Name',
  },
  {
    id: 'tasksName',
    key: 'name',
    label: 'My Tasks',
  },
  {
    id: 'assigned',
    key: '',
    label: 'Assigned',
  },
  {
    id: 'owedTo',
    key: 'reviewer.displayName',
    label: 'Owed to',
  },
  {
    id: 'status',
    key: 'status',
    label: 'Status',
  },
  {
    id: 'dependentTaskCount',
    key: 'dependentTaskCount',
    label: 'Dependent Tasks',
  },
  {
    id: 'submitted',
    key: '',
    label: 'Submitted',
  },
];

describe('SepTableBody component', () => {
  it('should show the table body cells', async () => {
    let sortBy = 'createdAt';
    const setSortBy = (value: string) => {
      sortBy = value;
    };
    let sortAsc = false;
    const setSortAsc = (value: boolean) => {
      sortAsc = value;
    };
    let selectedRow: string[] = [];
    const setSelectedRow = (value: string[]) => {
      selectedRow = value;
    };

    const { getByLabelText } = renderWithProviders(
      <SepTableBody
        rows={rows.tasks}
        count={rows.tasks.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
        selected={selectedRow}
        setSelected={setSelectedRow}
      />
    );

    const row = rows.tasks[0];
    expect(getByLabelText('SEP Id')).toHaveTextContent(row.sep.id.toString());
    expect(getByLabelText('SEP Name')).toHaveTextContent(row.sep.name);
    expect(getByLabelText('Tasks Name')).toHaveTextContent(row.name);
    expect(getByLabelText('Owed To')).toHaveTextContent(
      row.reviewer.displayName ? row.reviewer.displayName : ''
    );
    expect(getByLabelText('Tasks Status')).toHaveTextContent(
      row.status.toString()
    );
    expect(getByLabelText('Tasks DependentTaskCount')).toHaveTextContent(
      row.dependentTaskCount.toString()
    );
  });

  it('should check the seps row checkbox', async () => {
    let sortBy = 'createdAt';
    const setSortBy = (value: string) => {
      sortBy = value;
    };
    let sortAsc = false;
    const setSortAsc = (value: boolean) => {
      sortAsc = value;
    };
    let selectedRow: string[] = [];
    const setSelectedRow = (value: string[]) => {
      selectedRow = value;
    };

    const { getByLabelText } = renderWithProviders(
      <SepTableBody
        rows={rows.tasks}
        count={rows.tasks.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
        selected={selectedRow}
        setSelected={setSelectedRow}
      />
    );

    rows.tasks.forEach(async (row) => {
      const rowCheckbox = getByLabelText(`SEPs Row ${row.name}`);
      await fireEvent.click(rowCheckbox);
      expect(selectedRow.includes(row.name)).toEqual(true);
    });
  });

  it('should check the all checkbox', async () => {
    let sortBy = 'createdAt';
    const setSortBy = (value: string) => {
      sortBy = value;
    };
    let sortAsc = false;
    const setSortAsc = (value: boolean) => {
      sortAsc = value;
    };
    let selectedRow: string[] = [];
    const setSelectedRow = (value: string[]) => {
      selectedRow = value;
    };

    const { getByLabelText } = renderWithProviders(
      <SepTableBody
        rows={rows.tasks}
        count={rows.tasks.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
        selected={selectedRow}
        setSelected={setSelectedRow}
      />
    );

    const allCheckbox = getByLabelText(
      `Select all desserts`
    ) as HTMLInputElement;
    await fireEvent.click(allCheckbox);
    expect(selectedRow.length).toBe(rows.tasks.length);
  });

  it('should check the sort', async () => {
    let sortBy = 'createdAt';
    const setSortBy = (value: string) => {
      sortBy = value;
    };
    let sortAsc = true;
    const setSortAsc = (value: boolean) => {
      sortAsc = value;
    };
    let selectedRow: string[] = [];
    const setSelectedRow = (value: string[]) => {
      selectedRow = value;
    };

    const { getByLabelText } = renderWithProviders(
      <SepTableBody
        rows={rows.tasks}
        count={rows.tasks.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
        selected={selectedRow}
        setSelected={setSelectedRow}
      />
    );

    const NameLabelText = getByLabelText(`Table Sort Label name`);
    await fireEvent.click(NameLabelText);
    expect(sortBy).toBe('name');
    expect(sortAsc).toBe(true);
  });
});
