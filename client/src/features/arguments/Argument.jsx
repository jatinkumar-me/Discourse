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
	Tag,
	Text,
	useColorModeValue,
	useToast,
	VStack,
} from "@chakra-ui/react";

import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import TimeAgo from "~/components/TimeAgo";
import AddVote from "~/components/AddVote";
import {
	useGetArgumentsQuery,
	useAddVoteMutation,
	useEditArgumentMutation,
	useDeleteArgumentMutation,
} from "./argumentSlice";
import { useState } from "react";
import CommentList from "../comments/CommentList";
import ProfilePicture from "~/components/ProfilePicture";
import { VscComment } from "react-icons/vsc";
import ItemMenu from "~/components/ItemMenu";
import ArgumentForm from "./ArgumentForm";

const argumentStyle = {
	"h1": {
		"fontSize": "2rem",
		"fontWeight": "700",
	},
	"h2": {
		"fontSize": "1.2rem",
		"fontWeight": "700",
	},
	"pre": {
		"padding": "0.5rem",
		"backgroundColor": "#292929",
		"color": "#cacaca",
	},
	"blockQuote": {
		"px": "0.8rem",
		"py": "0.5rem",
		"my": "0.5rem",
		"borderLeft": "2px solid #636363",
	},
	"ul": {
		"px": "1rem",
	},
	"ol": {
		"px": "1rem",
	},
};

function Argument({ argumentId, debateId }) {
	const [isInEditMode, setIsInEditMode] = useState(false);
	const cfg = {};

	const { argumentData, isLoading } = useGetArgumentsQuery(debateId, {
		selectFromResult: ({ data, isLoading }) => ({
			argumentData: data?.entities[argumentId],
			isLoading,
		}),
	});
	const [addVote] = useAddVoteMutation();
	const [editArgument, { isLoading: isEditing, isError }] =
		useEditArgumentMutation();
	const [deleteArgument] = useDeleteArgumentMutation();
	const [showComments, setShowComments] = useState(false);

	if (isLoading) {
		return <></>;
	}
	const {
		userId: user,
		content,
		tag,
		createdAt,
		updatedAt,
		votes,
	} = argumentData;

	const converter = new QuillDeltaToHtmlConverter(content.ops, cfg);
	const html = converter.convert();
	const toast = useToast();

	const handleDelete = async () => {
		try {
			await deleteArgument({ debateId, argumentId }).unwrap();
		} catch (error) {
			throw error;
		}
	};

	const handleUpdate = async (payload) => {
		try {
			await editArgument({ debateId, argumentId, payload }).unwrap();
			toast({
				title: "Updated",
				description: "Post updated successfully",
				status: "success",
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Failed to update",
				status: "error",
			});
		}
	};

	return (
		<div>
			<Card
				mb={"4"}
				px="4"
				py="4"
				bg={useColorModeValue("white", "whiteAlpha.50")}
			>
				<VStack align={"baseline"} divider={<Divider />}>
					<CardHeader py={1} width="full" px={0}>
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
										<Tag
											mb={1}
											colorScheme={
												tag === "for"
													? "green"
													: tag === "against"
													? "red"
													: "blue"
											}
										>
											{tag}
										</Tag>
									</HStack>
									<Text fontSize="sm">{user.occupation}</Text>
								</Box>
							</Flex>
							<ItemMenu
								userId={user._id}
								onDelete={handleDelete}
								onEdit={() => setIsInEditMode(!isInEditMode)}
								menuFor="Argument"
							/>
						</Flex>
					</CardHeader>

					<CardBody p={0} sx={argumentStyle} width="full">
						{isInEditMode ? (
							<ArgumentForm
								isEditForm={true}
								debateId={debateId}
								defaultValue={content}
								onCancel={() => setIsInEditMode(!isInEditMode)}
								onUpdate={handleUpdate}
							/>
						) : (
							<div dangerouslySetInnerHTML={{ __html: html }}></div>
						)}
					</CardBody>

					<CardFooter py={2} px={0} width={"full"}>
						<Flex direction={"column"} width={"full"}>
							<HStack gap={1}>
								<AddVote
									votes={votes}
									argumentId={argumentId}
									onVote={(vote, curUserId) => {
										addVote({
											debateId,
											argumentId,
											vote,
											curUserId,
										});
									}}
								/>
								<Button
									leftIcon={<VscComment />}
									size="sm"
									variant={"outline"}
									onClick={() => setShowComments(!showComments)}
								>
									Comments
								</Button>
							</HStack>
							{showComments && <CommentList argumentId={argumentId} />}
						</Flex>
					</CardFooter>
				</VStack>
			</Card>
		</div>
	);
}

export default Argument;
