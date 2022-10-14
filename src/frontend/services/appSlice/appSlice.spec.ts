import appReducer, {
    AppState,
    setSnackbar,
  } from './appSlice';
  
  describe('appSlice', () => {
    const initialState: AppState = {
      snackbar: null
    };
  
    it('should handle setSnackbar', () => {
      const actual = appReducer(initialState, setSnackbar({text:'Success!', type: 'success'}));
      expect(actual.snackbar?.type).toEqual('success');
    });
  });
  