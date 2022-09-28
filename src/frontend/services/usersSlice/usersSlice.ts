import { sepAPI } from '../API';
import { User } from '../../../shared/types/User';

export const usersSlice = sepAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, string>({
      query: (id) => `users/${id}`,
    }),
  }),
});

export const { useGetUserQuery } = usersSlice;
