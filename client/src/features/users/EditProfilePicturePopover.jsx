import {
   Button,
	FormControl,
	IconButton,
	Input,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverFooter,
	PopoverHeader,
	PopoverTrigger,
   Text,
   useColorModeValue,
   useToast,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useUpdateProfilePictureMutation } from "./userSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setProfilePicture } from "../auth/authSlice";

function EditProfilePicturePopover({userId}) {
   const [file, setFile] = useState(null);
   const [inputContainsFile, setInputContainsFile] = useState(false);
   const [uploadImage, { isLoading }] = useUpdateProfilePictureMutation();
   const canSubmit = inputContainsFile && !isLoading;
	const dispatch = useDispatch()
   const toast = useToast();

   const handleFile = (event) => {
      setFile(event.target.files[0]);
      setInputContainsFile(true);
   }

   const handleSubmit = async () => {
      try {
         const body = new FormData();
         body.append('image', file)
         const res = await uploadImage({userId, body}).unwrap();
         toast({
            title:"Success",
            description: "Profile picture updated",
            duration: 3000,
            status: "success"
         })
			dispatch(setProfilePicture(res))
      } catch (error) {
         console.error(error);
         toast({
            title:"Error",
            description: "Couldn't update picture",
            duration: 3000,
            status: "error"
         })
      }
   }

	return (
		<Popover>
			<PopoverTrigger>
				<IconButton
					variant={"solid"}
					colorScheme="linkedin"
					icon={<EditIcon />}
					isRound
					aria-label="edit profile picture"
					position="absolute"
					display={"none"}
					sx={{
						".profile-pic:hover &": {
							display: "inline-block",
						},
					}}
				/>
			</PopoverTrigger>
			<PopoverContent color={useColorModeValue("gray.900", "whiteAlpha.800")} >
				<PopoverArrow />
				<PopoverHeader>
					<Text fontSize={"sm"}>Change profile picture</Text>
					<PopoverCloseButton />
				</PopoverHeader>
				<FormControl>
					<PopoverBody display={"flex"} alignItems="center">
						<Input type={"file"} name="image" onChange={handleFile} variant="flushed"size={"sm"}/>
					</PopoverBody>
					<PopoverFooter display={"flex"} justifyContent="end" gap={"2"}>
                  <Button size="sm" variant={"solid"} colorScheme="red">Cancel</Button>
						<Button size="sm" onClick={handleSubmit} isDisabled={!canSubmit}>Submit</Button>
					</PopoverFooter>
				</FormControl>
			</PopoverContent>
		</Popover>
	);
}

export default EditProfilePicturePopover;
