import * as snackbarUtils from '../services/appSlice/appSlice';
import { setSnackbarForEndpoint } from './snackbar';

jest.useFakeTimers();

describe('snackbar utils ', () => {
  describe('setSnackbarForEndpoint ', () => {
    it('should set a success snackbar when a query is fulfilled', async () => {
      const mockDispatch = jest.fn();
      const snackbarSpy = jest.spyOn(snackbarUtils, 'setSnackbar');
      await setSnackbarForEndpoint(
        {
          queryFulfilled: new Promise((resolve) => {
            return resolve(true);
          }),
          dispatch: mockDispatch,
        } as any,
        { successMessage: 'Hurray!', errorMessage: 'Oh no!' }
      );
      expect(snackbarSpy).toHaveBeenCalledWith({
        type: 'success',
        text: 'Hurray!',
      });
    });
  });
  it('should set an error snackbar when a query is rejected', async () => {
    const mockDispatch = jest.fn();
    const snackbarSpy = jest.spyOn(snackbarUtils, 'setSnackbar');
    await setSnackbarForEndpoint(
      {
        queryFulfilled: new Promise((resolve, reject) => {
          return reject(false);
        }),
        dispatch: mockDispatch,
      } as any,
      { successMessage: 'Hurray!', errorMessage: 'Oh no!' }
    );

    expect(snackbarSpy).toHaveBeenCalledWith({ type: 'error', text: 'Oh no!' });
  });
  it('should clear the snackbar after 5 seconds', async () => {
    const mockDispatch = jest.fn();
    const snackbarSpy = jest.spyOn(snackbarUtils, 'setSnackbar');
    await setSnackbarForEndpoint(
      {
        queryFulfilled: new Promise((resolve, reject) => {
          return reject(false);
        }),
        dispatch: mockDispatch,
      } as any,
      { successMessage: 'Hurray!', errorMessage: 'Oh no!' }
    );
    jest.advanceTimersByTime(6000);

    expect(snackbarSpy).toHaveBeenCalledWith(null);
  });
});
