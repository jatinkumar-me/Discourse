import { Container, Divider, Flex, Heading, Text, useBreakpointValue } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import PostSkeleton from "~/components/loadingSkeleton/PostSkeleton";
import Debates from "../debates/Debates";
import UserExcerpt from "./UserExcerpt";
import { useGetUserQuery } from "./userSlice";

function UserLayout() {
	const { userId } = useParams();
	const { data: user, isLoading, isError, isSuccess } = useGetUserQuery(userId);

	let content;
	if (isLoading) {
		content = <PostSkeleton />;
	} else if (isError) {
		content = <Text>Failed to fetch user data</Text>;
	} else {
		content = <UserExcerpt userId={userId} />;
	}

	return (
		<Container maxW={"5xl"} my={"5"}>
			<Flex
				justify={"space-between"}
				direction={useBreakpointValue({
					base: "column",
					md: "row",
				})}
            gap="4"
			>
				{content}
				<Flex direction={"column"} gap={"2"}>
               {isSuccess && <Text>
                  Debates by {user?.firstName}:
               </Text>}
               <Divider/>
					<Debates userId={userId}/>
				</Flex>
			</Flex>
		</Container>
	);
}

export default UserLayout;
