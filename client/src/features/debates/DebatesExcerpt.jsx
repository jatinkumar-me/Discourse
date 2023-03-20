import {
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Flex,
	Heading,
	HStack,
	Link,
	Tag,
	Text,
	useColorModeValue,
	VStack,
} from "@chakra-ui/react";
import { VscComment } from "react-icons/vsc";

import { Link as Navlink } from "react-router-dom";
import AddVote from "~/components/AddVote";
import ItemMenu from "~/components/ItemMenu";
import ProfilePicture from "~/components/ProfilePicture";
import TimeAgo from "~/components/TimeAgo";
import {
	useVoteDebateMutation,
	useGetDebatesQuery,
	useDeleteDebateMutation,
} from "./debateSlice";

function DebatesExcerpt({ debateId, params }) {
	const { debate, isLoading } = useGetDebatesQuery(params, {
		selectFromResult: ({ data, isLoading }) => {
			return { debate: data?.entities[debateId], isLoading };
		},
	});
	const [addVote] = useVoteDebateMutation();
	const bg = useColorModeValue("white", "gray.900");
	const [deleteDebate] = useDeleteDebateMutation();
	if (isLoading) return;
	const {
		userId: user,
		tags,
		title,
		description,
		createdAt,
		updatedAt,
		votes,
		_id,
	} = debate;
	const onDelete = async () => {
		try {
			await deleteDebate(debateId).unwrap()
		} catch (error) {
			throw error;
		}
	}

	return (
		<Card mb={"4"} px="4" py="4" bg={bg}>
			<VStack align={"baseline"} divider={<Divider />}>
				<CardHeader py={1} width="full" px={0}>
					<HStack spacing={2} mb={2}>
						{tags.map((tag, idx) => (
							<Tag key={idx} variant={"subtle"} colorScheme="gray">
								{tag}{" "}
							</Tag>
						))}
					</HStack>

					<Flex spacing="4" justify={"space-between"}>
						<Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
							<ProfilePicture
								fullName={`${user.firstName} ${user.lastName}`}
								size="md"
								userId={user._id}
							/>
							<Box>
								<HStack>
									<Heading size="md">{`${user.firstName} ${user.lastName}`}</Heading>
									<TimeAgo timestamp={createdAt} />
								</HStack>
								<Text fontSize="sm">{user.occupation}</Text>
							</Box>
						</Flex>

						<ItemMenu userId={user._id} menuFor="Debate" onDelete={onDelete}/>
					</Flex>
				</CardHeader>

				<CardBody px={0}>
					<Link as={Navlink} to={`/debates/${_id}`}>
						<Heading fontSize={"2xl"}>{title}</Heading>
					</Link>

					<Text>{description}</Text>
				</CardBody>

				<CardFooter py={2} px={0} width="full">
					<Flex gap="3" align="center" width={"full"}>
						<AddVote
							votes={votes}
							onVote={(vote, curUserId) => {
								addVote({ debateId, vote, curUserId, params });
							}}
						/>
						<Button
							as={Navlink}
							to={`/debates/${_id}`}
							leftIcon={<VscComment />}
							size="sm"
							variant="outline"
						>
							Arguments
						</Button>
					</Flex>
				</CardFooter>
			</VStack>
		</Card>
	);
}

export default DebatesExcerpt;
