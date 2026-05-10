import { apiSlice } from './apiSlice';

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: (params) => ({
        url: '/students',
        params,
      }),
      providesTags: ['Student'],
    }),
    getStudentById: builder.query({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),
    getMyProfile: builder.query({
      query: () => '/students/me',
      providesTags: ['Student'],
    }),
    getMyFees: builder.query({
      query: () => '/students/me/fees',
      providesTags: ['Student'],
    }),
    createStudent: builder.mutation({
      query: (data) => ({
        url: '/students',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Student', 'Dashboard'],
    }),
    updateStudent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, 'Student'],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student', 'Dashboard'],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useGetMyProfileQuery,
  useGetMyFeesQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;

