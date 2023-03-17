import { Box, Center, Spinner } from "@chakra-ui/react";
import Comment from "./Comment";
import CommentAndReplyForm from "./CommentAndReplyForm";
import { useAddCommentsMutation, useGetCommentsQuery } from "./commentSlice";

function CommentList({ argumentId }) {
	const {
		data: commentData,
		isLoading,
		isError,
		isSuccess,
		error,
	} = useGetCommentsQuery(argumentId);
	const [addComment, {isLoading : isPostingComment}] = useAddCommentsMutation()

	let content;
	if (isLoading) {
		content = <Center><Spinner/> Loading...</Center>;
	} else if (isSuccess) {
		if (commentData.ids.length) {
			content = (
				<div>
					{commentData.ids.map((id) => (
						<Comment key={id} commentId={id} argumentId={argumentId} />
					))}
				</div>
			);
		} else content = <p>No comments</p>;
	} else if (isError) {
		console.error("Failed to fetch comments", error);
		content = <p>{error}</p>;
	}

	return (
		<Box mt={"4"}>
			<CommentAndReplyForm isLoading={isPostingComment} formType = "comment" onPost={async (content) => {
				try {
					await addComment({ argumentId, content }).unwrap();
				} catch (err) {
					console.error("Failed to comment", err);
				}
			}} />
			{content}
		</Box>
	);
}

export default CommentList;
