import { apiSlice } from './apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getMonthlyRevenue: builder.query({
      query: (year) => `/dashboard/revenue${year ? `?year=${year}` : ''}`,
      providesTags: ['Dashboard'],
    }),
    getBatchWiseStats: builder.query({
      query: () => '/dashboard/batch-stats',
      providesTags: ['Dashboard'],
    }),
    getDepartmentStats: builder.query({
      query: () => '/dashboard/department-stats',
      providesTags: ['Dashboard'],
    }),
    getRecentTransactions: builder.query({
      query: () => '/dashboard/recent-transactions',
      providesTags: ['Dashboard', 'Payment'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetMonthlyRevenueQuery,
  useGetBatchWiseStatsQuery,
  useGetDepartmentStatsQuery,
  useGetRecentTransactionsQuery,
} = dashboardApi;
