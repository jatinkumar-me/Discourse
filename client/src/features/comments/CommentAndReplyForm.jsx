import { Button, HStack, Input, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../auth/authSlice";
import CurrentUserPicture from "../users/CurrentUserPicture";

function CommentAndReplyForm({ onPost, formType, isLoading }) {

	const [content, setContent] = useState("");
	const canPost = !isLoading && content.length >= 1;
	const user = useSelector(selectCurrentUser);
	const navigate = useNavigate();
	const location = useLocation();
	const toast = useToast();
	
	const handlePost = async () => {
		try {
			if (!user) {
				return navigate("/login", { state: { prev: location.pathname } });
			}
			await onPost(content);
			setContent("");
			toast({
				title: "Success",
				description: `${formType} added successfully`,
				duration: 2000,
				status: "success",
			});
		} catch (error) {}
	};

	return (
		<form>
			<HStack mb={"3"}>
				<CurrentUserPicture size={"sm"} />
				<Input
					type="text"
					name="content"
					id={`${formType}`}
					value={content}
					disabled={isLoading}
					onChange={(e) => setContent(e.target.value)}
					placeholder={`Add ${formType}...`}
					size={"sm"}
				/>
				<Button
					onClick={handlePost}
					disabled={!canPost}
					size={"sm"}
					variant="solid"
					px={5}
					isLoading={isLoading}
				>
					Add {`${formType}`}
				</Button>
			</HStack>
		</form>
	);
}

export default CommentAndReplyForm;
