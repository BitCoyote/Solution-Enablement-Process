import { response } from 'express'
import { microsoftAPI } from '../API/microsoftAPI'


export const microsoftSlice = microsoftAPI.injectEndpoints({
    endpoints: builder => ({
        getUserPhoto: builder.query<any, void>({
            query: () => {
                return {
                    url: 'me/photo/$value',
                    cache: "no-cache",
                    headers: {
                        'content-type': 'image/png',
                    },
                    responseHandler: async (response:any) => {
                        return window.URL.createObjectURL(await response.blob())
                    },
                }
            }
        })
    })
})

export const { useGetUserPhotoQuery } = microsoftSlice