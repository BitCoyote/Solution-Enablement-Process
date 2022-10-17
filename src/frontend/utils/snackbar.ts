import { MutationLifecycleApi } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { setSnackbar } from "../services/appSlice/appSlice";

interface SnackbarText {
    successMessage?: string;
    errorMessage?: string;
}
/** Shows a snackbar for 5 seconds based on whether a query is fulfilled or rejected */
export const setSnackbarForEndpoint = ({ queryFulfilled, dispatch }: MutationLifecycleApi<any, any, any>, snackbarText: SnackbarText) => {
    return queryFulfilled.then(() => {
        if (snackbarText.successMessage) {
            dispatch(setSnackbar({ type: 'success', text: snackbarText.successMessage }));
        }
    }).catch(() => {
        if (snackbarText.errorMessage) {
            dispatch(setSnackbar({ type: 'error', text: snackbarText.errorMessage }));
        }
    }).finally(() => {
        setTimeout(() => {
            dispatch(setSnackbar(null));
        }, 5000);
    });
}