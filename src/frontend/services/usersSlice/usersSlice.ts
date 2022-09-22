import { sepAPI } from '../API'
import { User } from '../../../shared/types/User'
import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query'


export const usersSlice = sepAPI.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query<User, string>({
            query: (id) => `users/${id}`,
        }),
    })
})

export const { useGetUserQuery  } = usersSlice