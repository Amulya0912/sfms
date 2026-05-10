import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosInstance } from '../../api/axios';

const axiosBaseQuery =
  () =>
  async (args) => {
    try {
      const url = typeof args === 'string' ? args : args.url;
      const method = typeof args === 'string' ? 'GET' : args.method || 'GET';
      const data = typeof args === 'string' ? undefined : args.data;
      const params = typeof args === 'string' ? undefined : args.params;
      const result = await axiosInstance({ url, method, data, params });
      return { data: result };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  tagTypes: ['User', 'Student', 'Department', 'AcademicYear', 'FeeCategory', 'FeeStructure', 'Payment', 'Scholarship', 'Receipt', 'Dashboard'],
  endpoints: () => ({}),
});
