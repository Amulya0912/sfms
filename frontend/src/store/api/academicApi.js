import { apiSlice } from './apiSlice';

export const academicApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: () => '/departments',
      providesTags: ['Department'],
    }),
    getAcademicYears: builder.query({
      query: () => '/academic-years',
      providesTags: ['AcademicYear'],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetAcademicYearsQuery,
} = academicApi;
