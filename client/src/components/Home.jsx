import { Box, Container, Divider, Flex, Select, Text } from "@chakra-ui/react";
import { useState } from "react";
import DebateForm from "~/features/debates/DebateForm";
import Debates from "~/features/debates/Debates";

function Home() {
	const [sortBy, setSortBy] = useState('createdAt')
	return (
		<Container maxW="3xl">
			<DebateForm />
			<Box>
				<Flex align={"flex-end"} justify="space-between" gap={2} my="3">
					<Text whiteSpace={"nowrap"}>Sort by: </Text>
					<Divider />
					<Select size={"sm"} maxW="150px" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
						<option value="-createdAt">Recent</option>
						<option value="createdAt">Oldest</option>
						<option value="-upvotes">Most voted</option>
						<option value="title">A-Z</option>
					</Select>
				</Flex>
			</Box>
			<Debates sort_by={sortBy}/>
		</Container>
	);
}

export default Home;
