import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "~/app/api/apiSlice";
import { mutateVoteDraft } from "../arguments/argumentSlice";

const debateAdapter = createEntityAdapter();
const initialState = debateAdapter.getInitialState();
const debateSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getDebates: builder.query({
			query: (params) => ({
				url: "/debates",
				params,
			}),
			transformResponse: (responseData) => {
				return responseData
					? debateAdapter.setAll(initialState, responseData)
					: initialState;
			},
			providesTags: (result, error, arg) => {
				return result
					? [
							{ type: "Debate", id: "LIST" },
							...result?.ids.map((id) => ({ type: "Debate", id })),
					  ]
					: [];
			},
		}),
		getDebate: builder.query({
			query: (debateId) => ({
				url: "/debates",
				params: { id: debateId },
			}),
		}),
		addNewDebate: builder.mutation({
			query: (payload) => ({
				url: "/debates",
				method: "POST",
				body: { ...payload },
			}),
			invalidatesTags: [
				{
					type: "Debate",
					id: "LIST",
				},
			],
		}),
		voteDebate: builder.mutation({
			query: ({ debateId, vote, curUserId, params }) => ({
				url: `/debates/${debateId}/vote`,
				method: "PATCH",
				body: { vote },
			}),
			async onQueryStarted(
				{ debateId, vote, curUserId, params },
				{ dispatch, queryFulfilled }
			) {
				const patchResult = dispatch(
					debateSlice.util.updateQueryData("getDebates", params, (draft) => {
						mutateVoteDraft(draft, debateId, curUserId, vote);
					})
				);
				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			},
		}),
		deleteDebate: builder.mutation({
			query: (debateId) => ({
				url: `/debates/${debateId}`,
				method: "DELETE",
			}),
			invalidatesTags: [{ type: "Debate", id: "LIST" }],
		}),
	}),
});

export const {
	useGetDebatesQuery,
	useAddNewDebateMutation,
	useVoteDebateMutation,
	useGetDebateQuery,
	useDeleteDebateMutation,
} = debateSlice;
