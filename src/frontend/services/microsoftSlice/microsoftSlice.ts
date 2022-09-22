import { microsoftAPI } from '../API/microsoftAPI'

interface Photo {
    photo: any
}

export const microsoftSlice = microsoftAPI.injectEndpoints({
    endpoints: builder => ({
        getUserPhoto: builder.query<Photo, void>({
            query: () => {
                return {
                    url: 'me/photo/$value'
                }
            }
        })
    })
})

export const { useGetUserPhotoQuery } = microsoftSlice