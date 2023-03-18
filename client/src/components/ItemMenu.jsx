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
	useToast,
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

function ItemMenu({ userId, onDelete, onEdit, menuFor }) {
	const curUser = useSelector(selectCurrentUser);
	let isCurUser = false;
	if (curUser && curUser._id === userId) isCurUser = true;
	const toast = useToast()

	const handleDelete = async () => {
		try {
			await onDelete();
			toast({
				title: "Deleted",
				description: `${menuFor || "Post"} deleted successfully`,
				status: "info",
			});
		} catch (error) {
			toast({
				title: "Failed to delete",
				status: "error",
			});
		} finally {
			onClose();
		}		
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
							{onEdit && (
								<MenuItem icon={<RiEdit2Line />} onClick={onEdit}>
									Edit
								</MenuItem>
							)}
							{onDelete && (
								<MenuItem icon={<RiDeleteBin6Line />} onClick={onOpen}>
									Delete
								</MenuItem>
							)}
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

						<AlertDialogBody>Permanently delete this {`${menuFor}`}?</AlertDialogBody>

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
