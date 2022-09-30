import React from "react";
import { renderWithProviders } from "../../../../testing/test-utils";
import "@testing-library/jest-dom";
import SepFilterBar from "./SepFilterBar";
import { fireEvent } from "@testing-library/react";
import { SEPPhase } from "../../../shared/types/SEP";

describe("SepFilterBar component", () => {
  it("should check all-checkbox", async () => {
    let statusChecked: SEPPhase[] = [];
    const setStatusChecked = (value: SEPPhase[]) => {
      statusChecked = value;
    };
    const { getByLabelText } = renderWithProviders(
      <SepFilterBar
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
    let statusChecked: SEPPhase[] = [];
    const setStatusChecked = (value: SEPPhase[]) => {
      statusChecked = value;
    };
    const { getByLabelText } = renderWithProviders(
      <SepFilterBar
        statusChecked={statusChecked}
        setStatusChecked={setStatusChecked}
      />
    );

    const statusCheckBox = getByLabelText(`SEP Status Checkbox 2`);
    await fireEvent.click(statusCheckBox);
    expect(statusChecked.includes(SEPPhase.implement)).toEqual(true);
  });
});
