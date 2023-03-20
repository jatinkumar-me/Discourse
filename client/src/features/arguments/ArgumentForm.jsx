import { useRef, useState } from "react";
import "./editorConfigs/quill.snow.css";
import ReactQuill from "react-quill";
import { useAddArgumentMutation } from "./argumentSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Select,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { formats, modules } from "./editorConfigs";
// import "react-quill/dist/quill.bubble.css";
// import "react-quill/dist/quill.snow.css";

function ArgumentForm({
	debateId,
	defaultValue,
	isEditForm,
	onCancel,
	onUpdate,
}) {
	const [value, setValue] = useState(defaultValue);
	const quillRef = useRef();
	const [addArgument, { isLoading }] = useAddArgumentMutation();
	const navigate = useNavigate();
	const location = useLocation();
	const user = useSelector(selectCurrentUser);
	const toast = useToast();

	const [tag, setTag] = useState("neutral");

	const editorStyles = {
		".quillRoot": {
			"--foreground": useColorModeValue("#0a0707", "#cfcfcf"),
			"--border-radius": "0.5rem",
			"--toolbar-background": useColorModeValue("#e6e6e6", "#303030"),
			"--editor-background": useColorModeValue("#ffffff", "#1b1b1b"),
			"--outline-color": useColorModeValue("#cecece", "#2c2c2c"),
		},
	};

	const handleSubmit = async () => {
		if (!user)
			return navigate("/login", { state: { prev: location.pathname } });

		try {
			const editor = quillRef.current.getEditor();
			const unprivilegedEditor =
				quillRef.current.makeUnprivilegedEditor(editor);
			const content = unprivilegedEditor.getContents();
			let payload;
			if (isEditForm) {
				payload = { content };
				onUpdate(payload);
				onCancel();
				return;
			}
			payload = { tag, content };
			await addArgument({ debateId, payload }).unwrap();
			setValue("");
			toast({
				title: "Success",
				description: "Argument posted.",
				duration: 3000,
				status: "success",
			});
		} catch (err) {
			console.error("Failed to add argument", err);
			toast({
				title: "Error",
				description: "Failed to post.",
				duration: 3000,
				status: "error",
			});
		}
	};

	return (
		<Flex as="section" direction={"column"} gap="0.4rem">
			{!isEditForm && (
				<FormControl>
					<HStack>
						<FormLabel size={"sm"}>Tag:</FormLabel>
						<Select
							size={"sm"}
							name="tag"
							value={tag}
							onChange={(e) => setTag(e.target.value)}
							maxW={"40"}
						>
							<option value="for">for</option>
							<option value="neutral">neutral</option>
							<option value="against">against</option>
						</Select>
					</HStack>
				</FormControl>
			)}
			<Box sx={editorStyles}>
				<div className="quillRoot">
					<ReactQuill
						theme="snow"
						value={value}
						// defaultValue={defaultValue}
						onChange={setValue}
						modules={modules}
						formats={formats}
						ref={quillRef}
					/>
				</div>
			</Box>
			<Flex justify={"flex-end"} mb="2">
				{isEditForm && (
					<Button
						variant={"solid"}
						size="sm"
						colorScheme={"red"}
						mr="2"
						onClick={onCancel}
					>
						Cancel
					</Button>
				)}
				<Button variant={"solid"} size="sm" onClick={handleSubmit}>
					Post
				</Button>
			</Flex>
		</Flex>
	);
}

export default ArgumentForm;
