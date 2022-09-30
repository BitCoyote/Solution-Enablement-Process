import React from "react";
import { renderWithProviders } from "../../../../testing/test-utils";
import "@testing-library/jest-dom";
import TasksFilterBar from "./TasksFilterBar";
import { fireEvent } from "@testing-library/react";
import { TaskStatus } from "../../../shared/types/Task";

describe("TasksFilterBar component", () => {
  it("should check all-checkbox", async () => {
    let statusChecked: TaskStatus[] = [];
    const setStatusChecked = (value: TaskStatus[]) => {
      statusChecked = value;
    };
    const { getByLabelText } = renderWithProviders(
      <TasksFilterBar
        statusChecked={statusChecked}
        setStatusChecked={setStatusChecked}
      />
    );
    const allCheckbox = getByLabelText(
      "Select All Statues"
    ) as HTMLInputElement;
    await fireEvent.click(allCheckbox);
    expect(statusChecked.length).toEqual(5);
  });

  it("should check status checkbox", async () => {
    let statusChecked: TaskStatus[] = [];
    const setStatusChecked = (value: TaskStatus[]) => {
      statusChecked = value;
    };
    const { getByLabelText } = renderWithProviders(
      <TasksFilterBar
        statusChecked={statusChecked}
        setStatusChecked={setStatusChecked}
      />
    );

    const statusCheckBox = getByLabelText(`Status Checkbox 2`);
    await fireEvent.click(statusCheckBox);
    expect(statusChecked.includes(TaskStatus.inReview)).toEqual(true);
  });
});
