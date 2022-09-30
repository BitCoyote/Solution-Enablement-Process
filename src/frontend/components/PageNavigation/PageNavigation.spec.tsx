import React from 'react';
import { renderWithProviders } from '../../../../testing/test-utils';
import '@testing-library/jest-dom';
import PageNavigation from './PageNavigation';
import { fireEvent } from '@testing-library/react';

describe('PageNavigation component', () => {
  it('should check prev page button', async () => {
    let page = 10;
    const setPage = (pageNumber: number) => {
      page = pageNumber;
    };
    let rowsPerPage = 25;
    const setRowsPerPage = (row: number) => {
      rowsPerPage = row;
    };
    const { getByLabelText } = renderWithProviders(
      <PageNavigation
        count={1000}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    );

    await fireEvent.click(getByLabelText('Prev Page Button'));
    expect(page).toBe(9);
  });
  it('should check next page button', async () => {
    let page = 10;
    const setPage = (pageNumber: number) => {
      page = pageNumber;
    };
    let rowsPerPage = 25;
    const setRowsPerPage = (row: number) => {
      rowsPerPage = row;
    };
    const { getByLabelText } = renderWithProviders(
      <PageNavigation
        count={1000}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    );

    await fireEvent.click(getByLabelText('Next Page Button'));
    expect(page).toBe(11);
  });

  it('should check rows per page button', async () => {
    let page = 10;
    const setPage = (pageNumber: number) => {
      page = pageNumber;
    };
    let rowsPerPage = 25;
    const setRowsPerPage = (row: number) => {
      rowsPerPage = row;
    };
    const { getByLabelText } = renderWithProviders(
      <PageNavigation
        count={1000}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    );

    await fireEvent.click(getByLabelText('Rows Per Page Option 5'));
    expect(rowsPerPage).toBe(5);
  });
});
