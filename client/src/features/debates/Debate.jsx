import { Link as Navlink, useParams } from "react-router-dom";
import ArgumentList from "../arguments/ArgumentList";
import ArgumentForm from "../arguments/ArgumentForm";
import { useGetDebateQuery } from "./debateSlice";
import PostSkeleton from "~/components/loadingSkeleton/PostSkeleton";
import {
	Box,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Container,
	Divider,
	Flex,
	Heading,
	HStack,
	IconButton,
	Link,
	Tag,
	Text,
	useColorModeValue,
	VStack,
} from "@chakra-ui/react";
import ProfilePicture from "~/components/ProfilePicture";
import TimeAgo from "~/components/TimeAgo";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";

function Debate() {
	const { debateId } = useParams();
	const { data: debate, isLoading, isError } = useGetDebateQuery(debateId);
	const curUser = useSelector(selectCurrentUser);

	let content;
	if (isLoading) content = <PostSkeleton />;
	else if (isError) content = <p>An error has occured</p>;
	else {
		const { userId: user, title, description, createdAt, tags } = debate;
		content = (
			<>
				<Card my={"4"} px="4" py="1" >
					<VStack align={"baseline"}>
						<CardHeader py={0} width="full" px={0}>
							<Flex spacing="1" justify={"space-between"}>
								<Flex flex="1" gap="2" alignItems="center" flexWrap="wrap">
									<ProfilePicture
										fullName={`${user.firstName} ${user.lastName}`}
										size="xs"
										userId={user._id}
									/>
									<Box>
										<HStack>
											<Text
												fontSize={"sm"}
											>{`${user.firstName} ${user.lastName}`}</Text>
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
						</CardHeader>

						<CardBody px={0} py={0}>
							<Heading fontSize={"4xl"}>{title}</Heading>

							<Text>{description}</Text>
						</CardBody>
						<Divider />
						<CardFooter py={2} px={0}>
							<HStack spacing={2} mb={2}>
								{tags.map((tag, idx) => (
									<Tag key={idx} variant={"subtle"} colorScheme="gray">
										{tag}
									</Tag>
								))}
							</HStack>
						</CardFooter>
					</VStack>
				</Card>

				{curUser && (
					<>
						<Text>
							Post as
							<Link
								as={Navlink}
								to={`users/${curUser._id}`}
							>{` ${curUser.firstName}`}</Link>
						</Text>
						<ArgumentForm debateId={debateId} />
					</>
				)}
				<ArgumentList debateId={debateId} />
			</>
		);
	}
	return (
		<Container maxW="3xl" as="section">
			{content}
		</Container>
	);
}

export default Debate;
