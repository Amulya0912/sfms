import { apiSlice } from './apiSlice';

export const feeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeeStructures: builder.query({
      query: (params) => ({
        url: '/fee-structures',
        params,
      }),
      providesTags: ['FeeStructure'],
    }),
    getFeeCategories: builder.query({
      query: () => '/fee-categories',
      providesTags: ['FeeCategory'],
    }),
    createFeeStructure: builder.mutation({
      query: (data) => ({
        url: '/fee-structures',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['FeeStructure', 'Dashboard'],
    }),
    updateFeeStructure: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/fee-structures/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['FeeStructure', 'Dashboard'],
    }),
    deleteFeeStructure: builder.mutation({
      query: (id) => ({
        url: `/fee-structures/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FeeStructure', 'Dashboard'],
    }),
  }),
});

export const {
  useGetFeeStructuresQuery,
  useGetFeeCategoriesQuery,
  useCreateFeeStructureMutation,
  useUpdateFeeStructureMutation,
  useDeleteFeeStructureMutation,
} = feeApi;
