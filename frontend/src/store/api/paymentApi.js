import { apiSlice } from './apiSlice';

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: (params) => ({
        url: '/payments',
        params,
      }),
      providesTags: ['Payment'],
    }),
    createPayment: builder.mutation({
      query: (data) => ({
        url: '/payments',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Payment', 'Dashboard', 'Student', 'Receipt'],
    }),
    updatePaymentStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/payments/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Payment', 'Dashboard', 'Student'],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentStatusMutation,
} = paymentApi;
