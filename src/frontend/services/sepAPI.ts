import { AccountInfo } from "@azure/msal-browser";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { UserWithRolesAndPermissions } from '../../shared/types/User'
import pca, { authRequest } from '../app/msal';
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    prepareHeaders: async (headers) => {
        // Request tokens from Azure AD (if needed)
        const response = await pca.acquireTokenSilent({ ...authRequest, account: pca.getAllAccounts()[0] as AccountInfo });
        headers.set('Authorization', `Bearer ${response.idToken}`);
        headers.set('access_token', `${response.accessToken}`);
        return headers;
    },
})

const dynamicBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // provide a dynamic base query that attaches the correct base url. 
    // This is necessary for easily integration testing with the backend because the REACT_APP_API_BASE_URL is dynamic and changes at the start of every test.
    const urlEnd = args;
    const adjustedUrl = `${process.env.REACT_APP_API_BASE_URL}/${urlEnd}`;
    // provide the amended url and other params to the raw base query
    return rawBaseQuery(adjustedUrl as string, api, extraOptions)
}

let keepUnusedDataFor = 60;
/* istanbul ignore if */
if (process.env.NODE_ENV === 'test') {
    // Do not cache data for tests
    keepUnusedDataFor = 0;
}
// Define a service using a base URL and expected endpoints
export const sepAPI = createApi({
    reducerPath: 'sepAPI',
    baseQuery: dynamicBaseQuery,
    keepUnusedDataFor, 
    endpoints: (builder) => ({
        getUser: builder.query<UserWithRolesAndPermissions, string>({
            query: (id) => `users/${id}`
        }),
    }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserQuery } = sepAPI;

