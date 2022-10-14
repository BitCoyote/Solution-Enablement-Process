import { sepAPI } from '../API';
import { Attachment } from '../../../shared/types/Attachment';
import { setSnackbarForEndpoint } from '../../utils/snackbar';

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
            onQueryStarted: (arg, api) => {
                setSnackbarForEndpoint(api, {
                    successMessage: 'Attachment uploaded successfully!',
                    errorMessage: 'There was a problem uploading your attachment.'
                });
            }
        }),
    }),
});

export const { useUploadNewAttachmentMutation } = attachmentSlice;
