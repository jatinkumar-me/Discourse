import { Divider, Flex, Text } from "@chakra-ui/react";
import FullName from "~/components/FullName";
import ItemMenu from "~/components/ItemMenu";
import ProfilePicture from "~/components/ProfilePicture";
import { useDeleteReplyMutation } from "./commentSlice";

function Reply({ reply, argumentId, commentId }) {
	const { firstName, lastName, userId, content, _id: replyId } = reply;
	const [deleteReply] = useDeleteReplyMutation();
	const onDelete = async () => {
		try {
			await deleteReply({replyId, commentId, argumentId});
		} catch (error) {
			throw error;
		}
	}
	return (
		<Flex direction={"column"} mb="2">
			<Divider />
			<Flex justify={"space-between"}>
				<Flex direction={"column"}>
					<Flex mb={1} mt={2} alignItems="flex-start" gap="2">
						<ProfilePicture
							size="2xs"
							userId={userId}
							fullName={`${firstName} ${lastName}`}
						/>
						<FullName
							firstName={firstName}
							lastName={lastName}
							userId={userId}
							size="xs"
						/>
					</Flex>
					<Text fontSize={"sm"}>{content}</Text>
				</Flex>
				<ItemMenu onDelete={onDelete} userId={userId} menuFor="Reply"/>
			</Flex>
		</Flex>
	);
}

export default Reply;
