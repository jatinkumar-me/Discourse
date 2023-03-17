import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "~/app/api/apiSlice";
import { mutateVoteDraft } from "../arguments/argumentSlice";

const commentAdapter = createEntityAdapter({
	selectId: (comment) => comment._id,
});
const initialState = commentAdapter.getInitialState();

const commentSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getComments: builder.query({
			query: (argumentId) => `/arguments/${argumentId}/comments`,
			transformResponse: (response) => {
				return commentAdapter.setAll(initialState, response);
			},
			providesTags: (result) => [
				{ type: "Comment", id: "LIST" },
				...result.ids.map((id) => ({ type: "Comment", id })),
			],
		}),
		addComments: builder.mutation({
			query: ({ argumentId, content }) => ({
				url: `arguments/${argumentId}/comments`,
				method: "POST",
				body: { content },
			}),
			invalidatesTags: [{ type: "Comment", id: "LIST" }],
		}),

		voteComment: builder.mutation({
			query: ({ commentId, argumentId, curUserId, vote }) => ({
				url: `arguments/${argumentId}/comments/${commentId}/vote`,
				method: "PATCH",
				body: { vote },
			}),
			async onQueryStarted(
				{ commentId, argumentId, curUserId, vote },
				{ dispatch, queryFulfilled }
			) {
				const patchResult = dispatch(
					commentSlice.util.updateQueryData(
						"getComments",
						argumentId,
						(draft) => {
							mutateVoteDraft(draft, commentId, curUserId, vote);
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
		deleteComment: builder.mutation({
			query: ({ commentId, argumentId }) => ({
				url: `arguments/${argumentId}/comments/${commentId}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Comment", id: arg.commentId },
			],
		}),
		addReply: builder.mutation({
			query: ({ commentId, argumentId, content }) => ({
				url: `arguments/${argumentId}/comments/${commentId}/reply`,
				method: "PATCH",
				body: { content },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Comment", id: arg.commentId },
			],
		}),
	}),
});

export const {
	useGetCommentsQuery,
	useAddCommentsMutation,
	useVoteCommentMutation,
	useAddReplyMutation,
	useDeleteCommentMutation,
} = commentSlice;
