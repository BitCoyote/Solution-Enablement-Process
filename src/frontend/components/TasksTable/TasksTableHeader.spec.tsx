import React from "react";
import { renderWithProviders } from "../../../../testing/test-utils";
import "@testing-library/jest-dom";
import TasksTableHeader from "./TasksTableHeader";
import {
  TaskSearchResult,
  TaskStatus,
  TaskPhase,
} from "../../../shared/types/Task";
import { DepartmentID } from "../../../shared/types/Department";

const rows: TaskSearchResult = {
  count: 1,
  tasks: [
    {
      id: 1,
      createdAt: "01/01/2021",
      updatedAt: "01/03/2021",
      name: "name",
      phase: TaskPhase.design,
      status: TaskStatus.inReview,
      departmentID: DepartmentID.legal,
      sep: {
        id: 1,
        name: "sepname",
        phase: TaskStatus.inReview,
      },
      dependentTaskCount: 2,
      assignee: { id: "1" },
      reviewer: { id: "1" },
    },
  ],
};

describe("TasksTableHeader component", () => {
  it("should show the result number", async () => {
    const { getByText } = renderWithProviders(
      <TasksTableHeader
        rows={rows.tasks}
        resultNumber={rows.tasks.length}
        showEditColumnsButton={true}
      />
    );
    expect(
      getByText(
        `${new Intl.NumberFormat("en-US").format(rows.tasks.length)} Results`
      )
    ).toBeInTheDocument();
  });

  it("should show the edit columns button", async () => {
    const { getByText } = renderWithProviders(
      <TasksTableHeader
        rows={rows.tasks}
        resultNumber={rows.tasks.length}
        showEditColumnsButton={true}
      />
    );
    expect(getByText("Edit Columns")).toBeInTheDocument();
  });
});
