import {
	Box,
	Container,
	Heading,
	IconButton,
	Stack,
	Text,
   useColorModeValue,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
	return (
		<Box as="footer" bg={useColorModeValue("gray.100", "gray.900")}>
			<Container
				as={Stack}
				maxW={"6xl"}
				py={4}
				direction={{ base: "column", md: "row" }}
				spacing={4}
				justify={{ base: "center", md: "space-between" }}
				align={{ base: "center", md: "center" }}
			>
				<Heading>Discourse</Heading>
				<Text fontSize="xs">
					© 2023 Made by Jatin Kumar. All rights reserved
				</Text>
				<Stack direction={"row"} spacing={6}>
					<IconButton aria-label="twitter" isRound icon={<FaTwitter />} />
					<IconButton aria-label="Youtube" isRound icon={<FaYoutube />} />
					<IconButton aria-label="Instagram" isRound icon={<FaInstagram />} />
				</Stack>
			</Container>
		</Box>
	);
}
