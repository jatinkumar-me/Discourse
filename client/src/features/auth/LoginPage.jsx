import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import Form from "./Form";

function LoginPage() {
	return (
		<Container maxW="3xl" as="section" mb={"10"}>
			<VStack mt={"10"} mb={"5"}>
				<Text fontSize={"sm"}>Welcome to,</Text>
				<Heading lineHeight={"9"} fontSize={"6xl"}>
					Discourse
				</Heading>
				<Text fontSize={"sm"}>
					A place to share your knowledge and ideas with the world
				</Text>
			</VStack>
			<Form />
		</Container>
	);
}

export default LoginPage;
