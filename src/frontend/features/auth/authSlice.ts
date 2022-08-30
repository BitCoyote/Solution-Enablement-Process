import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserWithRolesAndPermissions } from '../../../shared/types/User';
import { RootState } from '../../app/store';

export interface AuthState {
    user: UserWithRolesAndPermissions | null,
}

const initialState: AuthState = {
    user: null
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const getLoggedInUser = createAsyncThunk(
    'auth/getLoggedInUser',
    async () => {
        const response = await axios.get<UserWithRolesAndPermissions>(`${process.env.REACT_APP_API_BASE_URL as string}/users/me`);
        // The value we return becomes the `fulfilled` action payload
        return response.data;
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLoggedInUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
    }
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state: RootState) => state.auth.user;


export default authSlice.reducer;
