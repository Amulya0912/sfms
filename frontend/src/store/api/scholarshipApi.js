import { apiSlice } from './apiSlice';

export const scholarshipApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getScholarships: builder.query({
      query: (params) => ({
        url: '/scholarships',
        params,
      }),
      providesTags: ['Scholarship'],
    }),
    createScholarship: builder.mutation({
      query: (data) => ({
        url: '/scholarships',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Scholarship', 'Student'],
    }),
    deleteScholarship: builder.mutation({
      query: (id) => ({
        url: `/scholarships/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Scholarship', 'Student'],
    }),
  }),
});

export const {
  useGetScholarshipsQuery,
  useCreateScholarshipMutation,
  useDeleteScholarshipMutation,
} = scholarshipApi;
