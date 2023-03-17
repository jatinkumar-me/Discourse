
import {
	Avatar,
	Button,
	Card,
	CardFooter,
	CardHeader,
	Divider,
	Flex,
	Heading,
	HStack,
	Spacer,
	Text,
} from "@chakra-ui/react";
import {
	RiCalendar2Fill,
	RiMapPinFill,
	RiMessage2Line,
	RiShareForward2Line,
	RiSuitcaseLine,
	RiUserAddLine,
} from "react-icons/ri";
import { useSelector } from "react-redux";
import TimeAgo from "~/components/TimeAgo";
import { selectCurrentUser } from "../auth/authSlice";
import { useGetUserQuery } from "./userSlice";
import EditProfilePicturePopover from "./EditProfilePicturePopover";

function UserExcerpt({ userId }) {
	const { user } = useGetUserQuery(userId, {
		selectFromResult: ({ data }) => ({
			user: data,
		}),
	});

	const {
		firstName,
		lastName,
		occupation,
		location,
		createdAt,
		updatedAt,
		picture,
	} = user;
	const curUser = useSelector(selectCurrentUser);
	let isCurUser = false;
	const fullName = `${firstName} ${lastName || ""}`;
	if (curUser && curUser._id === userId) isCurUser = true;

	return (
		<Card maxW={"full"} minW="35%">
			<Flex direction={"column"} width="full">
				<CardHeader>
					<Flex
						gap={5}
						direction="column"
					>
						<Avatar
							name={fullName}
							className="profile-pic"
							src={`${import.meta.env.VITE_BASE_URL}/pictures/${picture}`}
							size="xl"
						>
							{isCurUser && <EditProfilePicturePopover userId={userId}/>}
						</Avatar>

						<Flex direction={"column"} width="full">
							<Heading fontSize={"3xl"}>{fullName}</Heading>
							<Divider my={"4"} />
							{occupation && (
								<HStack>
									<RiSuitcaseLine />
									<Text>{occupation}</Text>
								</HStack>
							)}
							{location && (
								<HStack>
									<RiMapPinFill />
									<Text>{location}</Text>
								</HStack>
							)}
							<HStack>
								<RiCalendar2Fill />
								<Text>Joined</Text>
								<TimeAgo timestamp={createdAt} />
							</HStack>
						</Flex>
					</Flex>
				</CardHeader>
				<Divider />
				<CardFooter>
					<Flex gap={2} width="full" wrap={"wrap"}>
						<Button leftIcon={<RiUserAddLine />} size="sm">
							Follow
						</Button>
						<Button leftIcon={<RiMessage2Line />} size="sm">
							Message
						</Button>
						<Spacer />
						<Button leftIcon={<RiShareForward2Line />} size="sm">
							Share
						</Button>
					</Flex>
				</CardFooter>
			</Flex>
		</Card>
	);
}

export default UserExcerpt;
