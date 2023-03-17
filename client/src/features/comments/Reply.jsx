import { Divider, Flex, Text } from "@chakra-ui/react";
import FullName from "~/components/FullName";
import ProfilePicture from "~/components/ProfilePicture";

function Reply({ reply }) {
	const { firstName, lastName, userId, content } = reply;
	return (
		<Flex direction={"column"} mb="2">
			<Divider />
			<Flex mb={1} mt={2} alignItems="flex-start" gap="2">
				<ProfilePicture
					size="2xs"
					userId={userId}
					fullName={`${firstName} ${lastName}`}
				/>
				<FullName firstName={firstName} lastName={lastName} userId={userId} size="xs"/>
			</Flex>
			<Text fontSize={"sm"}>{content}</Text>
		</Flex>
	);
}

export default Reply;
