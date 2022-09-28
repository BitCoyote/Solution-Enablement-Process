import {sepAPI} from '../API'
import { GetSEPExtendedResponse, GetSEPResponse, SEP, SEPSearchResult } from '../../../shared/types/SEP'

export const sepSlice = sepAPI.injectEndpoints({
    endpoints: builder => ({
        getSep: builder.query<GetSEPResponse, number>({
            query: (id) => `sep/${id}`
        }),
        findSeps: builder.query<SEPSearchResult, void>({
            query: () => `seps`
        }),
        getSepExtended:builder.query<GetSEPExtendedResponse, number>({
            query: (id) => `sep/${id}/extended`
        }),
    })
})

export const {
    useGetSepQuery, 
    useFindSepsQuery, 
    useLazyGetSepExtendedQuery
} = sepSlice