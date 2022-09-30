import React from 'react';
import { renderWithProviders } from '../../../../testing/test-utils';
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import TasksTableBody, { HeadCell } from './TasksTableBody';
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
    id: 'id',
    key: 'sep.id',
    label: 'SEP#',
  },
  {
    id: 'name',
    key: 'sep.name',
    label: 'SEP Name',
  },
  {
    id: 'phase',
    key: 'sep.phase',
    label: 'SEP Phase',
  },
  {
    id: 'tasksId',
    key: 'id',
    label: 'Tasks Id',
  },
  {
    id: 'tasksName',
    key: 'name',
    label: 'Tasks Name',
  },
  {
    id: 'tasksPhase',
    key: 'phase',
    label: 'Tasks Phase',
  },
  {
    id: 'tasksStatus',
    key: 'status',
    label: 'Tasks Status',
  },
  {
    id: 'departmentID',
    key: 'departmentID',
    label: 'Department ID',
  },
  {
    id: 'dependentTaskCount',
    key: 'dependentTaskCount',
    label: 'Dependent Task Count',
  },
  {
    id: 'assigneeId',
    key: 'assignee.id',
    label: 'Assignee Id',
  },
  {
    id: 'reviewerId',
    key: 'reviewer.id',
    label: 'Reviewer Id',
  },
  {
    id: 'createdAt',
    key: 'createdAt',
    label: 'CreatedAt',
  },
  {
    id: 'updatedAt',
    key: 'updatedAt',
    label: 'UpdatedAt',
  },
];

describe('TasksTableBody component', () => {
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
      <TasksTableBody
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
    expect(getByLabelText('SEP Phase')).toHaveTextContent(
      row.sep.phase.toString()
    );
    expect(getByLabelText('Tasks Id')).toHaveTextContent(row.id.toString());
    expect(getByLabelText('Tasks Name')).toHaveTextContent(row.name);
    expect(getByLabelText('Tasks Phase')).toHaveTextContent(
      row.phase.toString()
    );
    expect(getByLabelText('Tasks Status')).toHaveTextContent(
      row.status.toString()
    );
    expect(getByLabelText('Tasks DepartmentID')).toHaveTextContent(
      row.departmentID.toString()
    );
    expect(getByLabelText('Tasks DependentTaskCount')).toHaveTextContent(
      row.dependentTaskCount.toString()
    );
    expect(getByLabelText('Assignee Id')).toHaveTextContent(row.assignee.id);
    expect(getByLabelText('Reviewer Id')).toHaveTextContent(row.reviewer.id);
    expect(getByLabelText('Tasks CreatedAt')).toHaveTextContent(row.createdAt);
    expect(getByLabelText('Tasks UpdatedAt')).toHaveTextContent(row.updatedAt);
  });

  it('should check the tasks row checkbox', async () => {
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
      <TasksTableBody
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
      const rowCheckbox = getByLabelText(`Tasks Row ${row.name}`);
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
      <TasksTableBody
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
      <TasksTableBody
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

    const createdAtLabelText = getByLabelText(`Table Sort Label createdAt`);
    await fireEvent.click(createdAtLabelText);
    expect(sortBy).toBe('createdAt');
    expect(sortAsc).toBe(false);
    const NameLabelText = getByLabelText(`Table Sort Label sep.name`);
    await fireEvent.click(NameLabelText);
    expect(sortBy).toBe('sep.name');
    expect(sortAsc).toBe(true);
  });
});
