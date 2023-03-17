import { AddIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	Tag,
	TagCloseButton,
	TagLabel,
	Textarea,
	useColorModeValue,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "~/components/ProfilePicture";
import { selectCurrentUser, selectToken } from "../auth/authSlice";
import CurrentUserPicture from "../users/CurrentUserPicture";
import { useAddNewDebateMutation } from "./debateSlice";

function DebateForm() {
	const [addNewDebate, { isLoading }] = useAddNewDebateMutation();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [tags, setTags] = useState([]);
	const canSave = [title, description].every(Boolean) && !isLoading;
	const token = useSelector(selectToken);
	const user = useSelector(selectCurrentUser);
	const navigate = useNavigate();

	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const initialRef = useRef(null);
	const finalRef = useRef(null);

	const addTag = (e) => {
		if (e.key === "Enter" && e.target.value !== "") {
			setTags([...tags, e.target.value]);
			e.target.value = "";
		}
	};
	const removeTag = (e, tag) => {
		setTags([...tags.filter((tg) => tg !== tag)]);
	};

	const handleSubmit = async () => {
		if (!token) return navigate("/login");
		try {
			await addNewDebate({ title, description, tags }).unwrap();
			toast({
				title: "Posted Successfully",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			onClose();
			reset();
		} catch (err) {
			console.error("Failed to save the post", err);
			toast({
				title: "Failed to save the post",
				description: err.Error.TypeError,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const reset = () => {
		setTitle("");
		setDescription("");
		setTags([]);
	};

	if (!token) return <></>;

	return (
		<Box as="section" my={3}>
			<Flex align={"center"} gap="4" bg={useColorModeValue("white", "whiteAlpha.50")} p="2" borderRadius={"lg"} shadow="sm" >
				<CurrentUserPicture size={"md"}/>
				<InputGroup>
					<InputLeftElement pointerEvents={"none"} children={<AddIcon />} />
					<Input placeholder="Add new post..." onClick={onOpen} variant="outline"/>
				</InputGroup>
			</Flex>

			<Modal
				onClose={onclose}
				isOpen={isOpen}
				initialFocusRef={initialRef}
				finalFocusRef={finalRef}
				
			>
				<ModalOverlay/>
				<ModalContent bg={useColorModeValue("white", "gray.900")}>
					<ModalHeader>
						<Heading size={"md"}>Add new Post</Heading>
					</ModalHeader>

					<ModalCloseButton onClick={onClose} />

					<Divider />

					<ModalBody>
						<FormControl mb={3}>
							<FormLabel>Title</FormLabel>
							<Input
								name="title"
								aria-label="title"
								placeholder="Title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								ref={initialRef}
							/>
						</FormControl>

						<FormControl mb={3}>
							<FormLabel>Tags</FormLabel>
							<HStack>
								{tags.map((tag, idx) => (
									<Tag key={idx}>
										<TagLabel>{tag}</TagLabel>
										<TagCloseButton onClick={(e) => removeTag(e, tag)} />
									</Tag>
								))}
							</HStack>
							<Input
								name="tags"
								placeholder="Press enter to add tags"
								onKeyUp={(e) => addTag(e)}
							/>
						</FormControl>

						<FormControl>
							<FormLabel>Description</FormLabel>
							<Textarea
								id="description"
								name="description"
								placeholder="Description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</FormControl>
					</ModalBody>
					<Divider />

					<ModalFooter >
						<HStack gap={"1"}>
						<Button
							onClick={handleSubmit}
							disabled={!canSave}
							leftIcon={isLoading ? <Spinner /> : false}
							>
							Post
						</Button>
						<Button onClick={onClose} colorScheme="red" variant={"ghost"}>
							Cancel
						</Button>
							</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
}

export default DebateForm;
