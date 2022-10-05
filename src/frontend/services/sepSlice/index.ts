import { sepAPI } from '../API';
import {
  CreateSEPBody,
  GetSEPExtendedResponse,
  GetSEPResponse,
  SEP,
  SEPSearchResult,
  SearchParams,
} from '../../../shared/types/SEP';

export const sepSlice = sepAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSep: builder.query<GetSEPResponse, number>({
      query: (id) => `sep/${id}`,
    }),
    findSeps: builder.query<SEPSearchResult, SearchParams>({
      query: (arg) => {
        const { limit, offset, sortBy, sortAsc, status, search } = arg;
        return {
          url: 'seps',
          params: { limit, offset, sortBy, sortAsc, status, search },
        };
      },
    }),
    getSepExtended: builder.query<GetSEPExtendedResponse, number>({
      query: (id) => `sep/${id}/extended`,
    }),
    createSep: builder.mutation<SEP, Partial<CreateSEPBody>>({
      query: ({ ...body }) => {
        return {
          url: `sep`,
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const {
  useGetSepQuery,
  useFindSepsQuery,
  useGetSepExtendedQuery,
  useCreateSepMutation,
} = sepSlice;
