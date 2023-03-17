import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
	baseUrl: import.meta.env.VITE_BASE_URL,
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token;
		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});
export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery,
	tagTypes: ["Debate", "User", "Argument", "Comment"],
	endpoints: () => ({}),
});
