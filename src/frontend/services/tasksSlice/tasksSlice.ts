import { sepAPI } from '../API';
import { TaskSearchResult } from '../../../shared/types/Task';
import { SearchParams } from '../../../shared/types/SEP';
import { setSnackbarForEndpoint } from '../../utils/snackbar';

export const tasksSlice = sepAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<TaskSearchResult, SearchParams>({
      query: (arg) => {
        const { limit, offset, sortBy, sortAsc, status, assigneeId, search } =
          arg;
        return {
          url: 'tasks',
          params: {
            limit,
            offset,
            sortBy,
            sortAsc,
            status,
            'assignee.id': assigneeId,
            search,
          },
        };
      },
      onQueryStarted: (arg, api) => {
        setSnackbarForEndpoint(api, {
          errorMessage: 'There was a problem getting the tasks.',
        });
      },
    }),
  }),
});

export const { useGetTasksQuery } = tasksSlice;
