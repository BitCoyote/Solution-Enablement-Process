import React from "react";
import { renderWithProviders } from "../../../../testing/test-utils";
import "@testing-library/jest-dom";
import SepTableHeader from "./SepTableHeader";
import { SEPSearchResult, SEPPhase } from "../../../shared/types/SEP";

const rows: SEPSearchResult = {
  count: 1,
  seps: [
    {
      id: 1,
      createdAt: "01/01/2021",
      updatedAt: "01/03/2021",
      name: "name",
      description: "description",
      createdBy: "createdBy",
      phase: SEPPhase.complete,
      creator: {
        id: "1",
        createdAt: "01/01/2021",
        updatedAt: "01/03/2021",
      },
    },
  ],
};

describe("SepTableHeader component", () => {
  it("should show the result number", async () => {
    const { getByText } = renderWithProviders(
      <SepTableHeader
        rows={rows.seps}
        resultNumber={rows.seps.length}
        showEditColumnsButton={true}
      />
    );
    expect(
      getByText(
        `${new Intl.NumberFormat("en-US").format(rows.seps.length)} Results`
      )
    ).toBeInTheDocument();
  });

  it("should show the edit columns button", async () => {
    const { getByText } = renderWithProviders(
      <SepTableHeader
        rows={rows.seps}
        resultNumber={rows.seps.length}
        showEditColumnsButton={true}
      />
    );
    expect(getByText("Edit Columns")).toBeInTheDocument();
  });
});
