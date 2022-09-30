import React from "react";
import { renderWithProviders } from "../../../../testing/test-utils";
import "@testing-library/jest-dom";
import StatusCell from "./StatusCell";
import { TaskStatus } from "../../../shared/types/Task";

describe("StatusCell component", () => {
  it("should show the status", async () => {
    const { getByText } = renderWithProviders(
      <StatusCell status={TaskStatus.changesRequested} />
    );
    expect(getByText(TaskStatus.changesRequested.toString())).toBeInTheDocument();
  });
});
