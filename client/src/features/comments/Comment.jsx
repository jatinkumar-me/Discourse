import { useState } from "react";
import AddVote from "~/components/AddVote";
import ProfilePicture from "~/components/ProfilePicture";
import TimeAgo from "~/components/TimeAgo";
import {
	useAddReplyMutation,
	useGetCommentsQuery,
	useVoteCommentMutation,
} from "./commentSlice";
import CommentAndReplyForm from "./CommentAndReplyForm";

import { VscChevronDown, VscChevronUp, VscComment } from "react-icons/vsc";
import Reply from "./Reply";
import {
	Box,
	Button,
	Divider,
	Flex,
	HStack,
	IconButton,
	Text,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import FullName from "~/components/FullName";

function Comment({ commentId, argumentId }) {
	const { comment } = useGetCommentsQuery(argumentId, {
		selectFromResult: ({ data }) => ({
			comment: data?.entities[commentId],
		}),
	});
	const [addVote] = useVoteCommentMutation();
	const [addReply, { isLoading }] = useAddReplyMutation();

	const [showReplies, setShowReplies] = useState(false);
	const [showReplyForm, setShowReplyForm] = useState(false);
	if (!comment) return <p>failed to fetch</p>;

	const { content, userId: user, createdAt, replies, votes } = comment;
	const { _id: userId, firstName, lastName } = user;

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

				<IconButton
					isRound
					variant="ghost"
					colorScheme="gray"
					aria-label="See menu"
					icon={<BsThreeDotsVertical />}
				/>
			</Flex>
			<Text size={"sm"} mb={2}>
				{content}
			</Text>

			<Flex align={"center"} gap="2" mb="2">
				<AddVote
					votes={votes}
					size="xs"
					onVote={(vote, curUserId) => {
						addVote({ commentId, argumentId, curUserId, vote });
					}}
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
						onPost={async (content) => {
							try {
								await addReply({ commentId, argumentId, content }).unwrap();
							} catch (err) {
								console.error("Failed to reply", err);
							}
						}}
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
