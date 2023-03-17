import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "~/app/api/apiSlice";

const argumentAdapter = createEntityAdapter();
const initialState = argumentAdapter.getInitialState();

const argumentSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getArguments: builder.query({
			query: (debateId) => ({
				url: `/debates/${debateId}/arguments`,
			}),
			transformResponse: (response) => {
				return argumentAdapter.setAll(initialState, response);
			},
			providesTags: (result, error, arg) => [
				{ type: "Argument", id: "LIST" },
				...result.ids.map((id) => ({ type: "Argument", id })),
			],
		}),

		addArgument: builder.mutation({
			query: ({ debateId, payload }) => ({
				url: `debates/${debateId}/arguments`,
				method: "POST",
				body: { ...payload },
			}),
			invalidatesTags: [{ type: "Argument", id: "LIST" }],
		}),

		editArgument: builder.mutation({
			query: ({ debateId, argumentId, payload }) => ({
				url: `debates/${debateId}/arguments/${argumentId}`,
				method: "PATCH",
				body: { ...payload },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Argument", id: arg.argumentId },
			],
		}),

		deleteArgument: builder.mutation({
			query: ({debateId, argumentId}) => ({
				url: `debates/${debateId}/arguments/${argumentId}`,
				method: "DELETE",
			}),
			invalidatesTags: [{type: "Argument", id: "LIST"}]
		}),

		addVote: builder.mutation({
			query: ({ debateId, argumentId, vote, curUserId }) => ({
				url: `debates/${debateId}/arguments/${argumentId}/vote`,
				method: "PATCH",
				body: { vote },
			}),
			async onQueryStarted(
				{ debateId, argumentId, vote, curUserId },
				{ dispatch, queryFulfilled }
			) {
				const patchResult = dispatch(
					argumentSlice.util.updateQueryData(
						"getArguments",
						debateId,
						(draft) => {
							mutateVoteDraft(draft, argumentId, curUserId, vote);
						}
					)
				);
				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			},
		}),
	}),
});

export const {
	useGetArgumentsQuery,
	useAddArgumentMutation,
	useAddVoteMutation,
	useEditArgumentMutation,
	useDeleteArgumentMutation,
} = argumentSlice;

export function mutateVoteDraft(draft, entityId, curUserId, vote) {
	const entity = draft.entities[entityId];
	if (curUserId in entity.votes && entity.votes[curUserId] === vote)
		delete entity.votes[curUserId];
	else entity.votes[curUserId] = vote;
}
