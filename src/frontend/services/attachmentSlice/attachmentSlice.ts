import { sepAPI } from '../API';
import { Attachment } from '../../../shared/types/Attachment';

export const attachmentSlice = sepAPI.injectEndpoints({
    endpoints: (builder) => ({
        uploadNewAttachment: builder.mutation<Attachment, any>({
            query: (arg) => {
                const { sepID, taskID, data } = arg;
                return {
                    url: `sep/${sepID}/attachment/upload`,
                    params: { taskID },
                    method: 'POST',
                    body: data
                };
            },
        }),
    }),
});

export const { useUploadNewAttachmentMutation } = attachmentSlice;
