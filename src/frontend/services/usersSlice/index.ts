import { sepAPI } from '../API';
import { User } from '../../../shared/types/User';
import { setSnackbarForEndpoint } from '../../utils/snackbar';

export const usersSlice = sepAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, string>({
      query: (id) => `users/${id}`,
      onQueryStarted: (arg, api) => {
        setSnackbarForEndpoint(api, {
          errorMessage: 'There was a problem getting this user.',
        });
      },
    }),
  }),
});

export const { useGetUserQuery } = usersSlice;
