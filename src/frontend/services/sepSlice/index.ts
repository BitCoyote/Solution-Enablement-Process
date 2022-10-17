import { sepAPI } from '../API';
import {
  CreateSEPBody,
  GetSEPExtendedResponse,
  GetSEPResponse,
  SEP,
  SEPSearchResult,
  SearchParams,
} from '../../../shared/types/SEP';
import { setSnackbarForEndpoint } from '../../utils/snackbar';

export const sepSlice = sepAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSep: builder.query<GetSEPResponse, number>({
      query: (id) => `sep/${id}`,
      onQueryStarted: (arg, api) => {
        setSnackbarForEndpoint(api, {
          errorMessage: 'There was a problem getting this SEP.'
        });
      }
    }),
    findSeps: builder.query<SEPSearchResult, SearchParams>({
      query: (arg) => {
        const { limit, offset, sortBy, sortAsc, status, search } = arg;
        return {
          url: 'seps',
          params: { limit, offset, sortBy, sortAsc, status, search },
        };
      },
      onQueryStarted: (arg, api) => {
        setSnackbarForEndpoint(api, {
          errorMessage: 'There was a problem getting the list of SEPs.'
        });
      }
    }),
    getSepExtended: builder.query<GetSEPExtendedResponse, number>({
      query: (id) => `sep/${id}/extended`,
      onQueryStarted: (arg, api) => {
        setSnackbarForEndpoint(api, {
          errorMessage: 'There was a problem getting this SEP.'
        });
      }
    }),
    createSep: builder.mutation<SEP, Partial<CreateSEPBody>>({
      query: ({ ...body }) => {
        return {
          url: `sep`,
          method: 'POST',
          body,
        };
      },
      onQueryStarted: (arg, api) => {
        setSnackbarForEndpoint(api, {
          successMessage: 'SEP created succesfully!',
          errorMessage: 'There was a problem creating your SEP.'
        });
      }
    }),
  }),
});

export const {
  useGetSepQuery,
  useFindSepsQuery,
  useGetSepExtendedQuery,
  useCreateSepMutation,
} = sepSlice;
