import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
	RiDeleteBin6Line,
	RiEdit2Line,
	RiFlag2Line,
	RiShareForward2Line,
} from "react-icons/ri";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "~/features/auth/authSlice";

function ItemMenu({ userId, onDelete, onEdit}) {
	const curUser = useSelector(selectCurrentUser);
	let isCurUser = false;
	if (curUser && curUser._id === userId) isCurUser = true;

	const handleDelete = () => {
		onDelete();
		onClose();
	};

	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef();

	return (
		<>
			<Menu>
				<MenuButton
					as={IconButton}
					aria-label="Options"
					icon={<BsThreeDotsVertical />}
					isRound
					variant="ghost"
				/>
				<MenuList>
					<MenuItem icon={<RiShareForward2Line />}>Share</MenuItem>
					{isCurUser && (
						<>
							<MenuItem icon={<RiEdit2Line />} onClick={onEdit}>Edit</MenuItem>
							<MenuItem icon={<RiDeleteBin6Line />} onClick={onOpen} >Delete</MenuItem>
						</>
					)}
					<MenuItem icon={<RiFlag2Line />}>Report</MenuItem>
				</MenuList>
			</Menu>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Confirm Delete
						</AlertDialogHeader>

						<AlertDialogBody>Permanently delete this post?</AlertDialogBody>

						<AlertDialogFooter>
							<Button size={"sm"} ref={cancelRef} onClick={onClose}>
								Cancel
							</Button>
							<Button
								size={"sm"}
								colorScheme="red"
								onClick={handleDelete}
								ml={3}
							>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
}

export default ItemMenu;