import { apiSlice } from './apiSlice';

export const receiptApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReceipts: builder.query({
      query: (params) => ({
        url: '/receipts',
        params,
      }),
      // Transform: backend returns array directly (no pagination wrapper for receipts)
      transformResponse: (response) => ({
        data: response?.data || response || [],
        pagination: response?.pagination || null,
      }),
      providesTags: ['Receipt'],
    }),
  }),
});

export const { useGetReceiptsQuery } = receiptApi;
