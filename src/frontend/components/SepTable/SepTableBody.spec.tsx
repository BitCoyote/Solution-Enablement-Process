import React from "react";
import { renderWithProviders } from "../../../../testing/test-utils";
import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";
import SepTableBody, { HeadCell } from "./SepTableBody";
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

export const headCells: readonly HeadCell[] = [
  {
    id: "id",
    key: "id",
    label: "SEP#",
  },
  {
    id: "name",
    key: "name",
    label: "SEP Name",
  },
  {
    id: "description",
    key: "description",
    label: "Description",
  },
  {
    id: "phase",
    key: "phase",
    label: "Phase",
  },
  {
    id: "createdBy",
    key: "createdBy",
    label: "Created By",
  },
  {
    id: "creatorId",
    key: "creator.id",
    label: "Creator Id",
  },
  {
    id: "createdAt",
    key: "createdAt",
    label: "CreatedAt",
  },
  {
    id: "updatedAt",
    key: "updatedAt",
    label: "UpdatedAt",
  },
];

describe("SepTableBody component", () => {
  it("should show the table body cells", async () => {
    let sortBy = "createdAt";
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
        rows={rows.seps}
        count={rows.seps.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
        selected={selectedRow}
        setSelected={setSelectedRow}
      />
    );

    const row = rows.seps[0];
    expect(getByLabelText("SEP Id")).toHaveTextContent(row.id.toString());
    expect(getByLabelText("SEP Name")).toHaveTextContent(row.name);
    expect(getByLabelText("SEP Description")).toHaveTextContent(
      row.description ? row.description : ""
    );
    expect(getByLabelText("SEP Phase")).toHaveTextContent(row.phase.toString());
    expect(getByLabelText("Create By")).toHaveTextContent(row.createdBy);
    expect(getByLabelText("Creator Id")).toHaveTextContent(row.creator.id);
    expect(getByLabelText("SEP CreatedAt")).toHaveTextContent(row.createdAt);
    expect(getByLabelText("SEP UpdatedAt")).toHaveTextContent(row.updatedAt);
  });

  it("should check the seps row checkbox", async () => {
    let sortBy = "createdAt";
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
        rows={rows.seps}
        count={rows.seps.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
        selected={selectedRow}
        setSelected={setSelectedRow}
      />
    );

    rows.seps.forEach(async (row) => {
      const rowCheckbox = getByLabelText(`SEPs Row ${row.name}`);
      await fireEvent.click(rowCheckbox);
      expect(selectedRow.includes(row.name)).toEqual(true);
    });
  });

  it("should check the all checkbox", async () => {
    let sortBy = "createdAt";
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
        rows={rows.seps}
        count={rows.seps.length}
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
    expect(selectedRow.length).toBe(rows.seps.length);
  });

  it("should check the sort", async () => {
    let sortBy = "createdAt";
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
        rows={rows.seps}
        count={rows.seps.length}
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
    expect(sortBy).toBe("createdAt");
    expect(sortAsc).toBe(false);
    const NameLabelText = getByLabelText(`Table Sort Label name`);
    await fireEvent.click(NameLabelText);
    expect(sortBy).toBe("name");
    expect(sortAsc).toBe(true);
  });
});
