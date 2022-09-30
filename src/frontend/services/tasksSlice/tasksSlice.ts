import { sepAPI } from '../API';
import { TaskSearchResult } from '../../../shared/types/Task';
import { SearchParams } from '../../../shared/types/SEP';

export const tasksSlice = sepAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<TaskSearchResult, SearchParams>({
      query: (arg) => {
        const { limit, offset, sortBy, sortAsc, status, search } = arg;
        return {
          url: 'tasks',
          params: { limit, offset, sortBy, sortAsc, status, search },
        };
      },
    }),
  }),
});

export const { useGetTasksQuery } = tasksSlice;
