import { apiSlice } from "~/app/api/apiSlice";


export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUser: builder.query({
			query: (userId) => `/users/${userId}`,
			providesTags: ["User"],
		}),
		updateProfilePicture: builder.mutation({
			query: ({ userId, body }) => ({
				url: `/users/change-profile-pic`,
				method: "PUT",
				body,
			}),
			invalidatesTags: ["User"]
		}),
	}),
});

export const { useGetUserQuery, useUpdateProfilePictureMutation } = usersApiSlice;
