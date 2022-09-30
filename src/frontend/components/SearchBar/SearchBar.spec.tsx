import React from "react";
import { renderWithProviders } from "../../../../testing/test-utils";
import "@testing-library/jest-dom";
import SearchBar from "./SearchBar";
import { fireEvent } from "@testing-library/react";

describe("SearchBar component", () => {
  it("should show the title", async () => {
    let searchText = "";
    const title = "All SEPs";
    const setSearchText = (text: string) => {
      searchText = text;
    };
    const { getByText } = renderWithProviders(
      <SearchBar
        title={title}
        searchText={searchText}
        setSearchText={setSearchText}
      />
    );
    expect(getByText(title)).toBeInTheDocument();
  });

  it("should show input text", async () => {
    let searchText = "";
    const title = "All SEPs";
    const setSearchText = (text: string) => {
      searchText = text;
    };
    const { getByLabelText } = renderWithProviders(
      <SearchBar
        title={title}
        searchText={searchText}
        setSearchText={setSearchText}
      />
    );
    const field = getByLabelText("Search TextField").querySelector(
      "input"
    ) as HTMLInputElement;
    expect(field).toBeInTheDocument();

    fireEvent.change(field, { target: { value: "search" } });
    expect(searchText).toBe("search");
  });
});
