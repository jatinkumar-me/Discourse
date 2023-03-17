import { useState } from "react";
import AddVote from "~/components/AddVote";
import ProfilePicture from "~/components/ProfilePicture";
import TimeAgo from "~/components/TimeAgo";
import {
	useAddReplyMutation,
	useDeleteCommentMutation,
	useGetCommentsQuery,
	useVoteCommentMutation,
} from "./commentSlice";
import CommentAndReplyForm from "./CommentAndReplyForm";

import { VscChevronDown, VscChevronUp, VscComment } from "react-icons/vsc";
import Reply from "./Reply";
import { Box, Button, Divider, Flex, HStack, Text } from "@chakra-ui/react";
import FullName from "~/components/FullName";
import ItemMenu from "~/components/ItemMenu";

function Comment({ commentId, argumentId }) {
	const { comment } = useGetCommentsQuery(argumentId, {
		selectFromResult: ({ data }) => ({
			comment: data?.entities[commentId],
		}),
	});
	const [addVote] = useVoteCommentMutation();
	const [addReply, { isLoading }] = useAddReplyMutation();
	const [deleteComment] = useDeleteCommentMutation();

	const [showReplies, setShowReplies] = useState(false);
	const [showReplyForm, setShowReplyForm] = useState(false);
	if (!comment) return <p>failed to fetch</p>;

	const { content, userId: user, createdAt, replies, votes } = comment;
	const { _id: userId, firstName, lastName } = user;

	const onDelete = async () => {
		try {
			await deleteComment({ commentId, argumentId });
		} catch (error) {
			throw error;
		}
	}

	const onPost = async (content) => {
		try {
			await addReply({ commentId, argumentId, content }).unwrap();
		} catch (err) {
			console.error("Failed to reply", err);
		}
	}

	const onVote = async (vote, curUserId) => {
		addVote({ commentId, argumentId, curUserId, vote });
	}

	return (
		<div>
			<Divider />
			<Flex spacing="1" justify={"space-between"}>
				<Flex flex="1" gap="2" alignItems="center" flexWrap="wrap">
					<ProfilePicture
						fullName={`${firstName} ${lastName}`}
						size="xs"
						userId={userId}
					/>
					<Box>
						<HStack>
							<FullName
								firstName={firstName}
								lastName={lastName}
								userId={userId}
								size={"sm"}
							/>
							<TimeAgo timestamp={createdAt} />
						</HStack>
					</Box>
				</Flex>

				<ItemMenu
					userId={userId}
					onDelete={onDelete}
					menuFor="Comment"
				/>
			</Flex>
			<Text size={"sm"} mb={2}>
				{content}
			</Text>

			<Flex align={"center"} gap="2" mb="2">
				<AddVote
					votes={votes}
					size="xs"
					onVote={onVote}
				/>

				<Button
					leftIcon={<VscComment />}
					size="xs"
					variant={"outline"}
					onClick={() => setShowReplyForm(!showReplyForm)}
				>
					Reply
				</Button>

				{replies.length > 0 && (
					<Button
						size={"xs"}
						variant={"link"}
						rightIcon={showReplies ? <VscChevronUp /> : <VscChevronDown />}
						onClick={() => setShowReplies(!showReplies)}
					>
						{`${replies.length} repl${replies.length === 1 ? `y` : `ies`}`}
					</Button>
				)}
			</Flex>
			<Flex direction={"column"} maxW={"95%"} position="relative" left={"5%"}>
				{showReplyForm && (
					<CommentAndReplyForm
						isLoading={isLoading}
						formType="reply"
						onPost={onPost}
					/>
				)}

				{showReplies && (
					<>
						{replies.map((reply) => (
							<Reply reply={reply} key={reply._id} />
						))}
					</>
				)}
			</Flex>
		</div>
	);
}

export default Comment;
