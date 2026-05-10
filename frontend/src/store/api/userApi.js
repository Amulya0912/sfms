import { apiSlice } from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => '/users/roles',
      providesTags: ['User'],
    }),
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

