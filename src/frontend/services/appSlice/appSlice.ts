import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
export interface AppState {
    snackbar: SnackbarState | null;
}

const initialState: AppState = {
    snackbar: null
};

export interface SnackbarState {
    text: string;
    type: 'success' | 'error';
}

/** A slice used for general application-level stored data */
export const appSlice = createSlice({
    name: 'app',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setSnackbar: (state, action: PayloadAction<SnackbarState | null>) => {
            state.snackbar = action.payload;
        },
    },
});

export const { setSnackbar } = appSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.app.value)`
export const selectSnackbar = (state: RootState): SnackbarState | null => state.app.snackbar;

export default appSlice.reducer;
