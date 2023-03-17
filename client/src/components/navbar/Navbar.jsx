import { useSelector } from "react-redux";
import { Link as NavLink, useNavigate } from "react-router-dom";
import { logout, selectCurrentUser } from "~/features/auth/authSlice";
import {
	Box,
	Flex,
	HStack,
	IconButton,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	useColorModeValue,
	Heading,
	Divider,
} from "@chakra-ui/react";
import StyleColorMode from "./StyleColorMode";
import { FaGithub, FaHome } from "react-icons/fa";
import ProfilePicture from "../ProfilePicture";
import { UnlockIcon } from "@chakra-ui/icons";
import CurrentUserPicture from "~/features/users/CurrentUserPicture";

function Navbar() {
	const user = useSelector(selectCurrentUser);
	let fullName, userId;
	if (user) {
		const { firstName, lastName, _id } = user;
		fullName = `${firstName} ${lastName}`;
		userId = _id;
	}
	const navigate = useNavigate();
	return (
		<Box as="nav" bg={useColorModeValue("gray.100", "gray.900")} px={4}>
			<Flex h={12} alignItems={"center"} justifyContent="space-between">
				<HStack spacing={2} alignItems={"center"}>
					<Box>
						<Heading fontSize="xl">Discourse</Heading>
					</Box>
					<Divider height={8} orientation="vertical" />
					<NavLink to="/">
						<IconButton
							aria-label="home"
							variant="ghost"
							size="sm"
							icon={<FaHome />}
						/>
					</NavLink>
					<IconButton
						aria-label="home"
						variant="ghost"
						size="sm"
						icon={<FaGithub />}
					/>
				</HStack>

				<Flex alignItems={"center"} gap="1rem">
					<StyleColorMode />
					{user ? (
						<Menu>
							<MenuButton
								rounded={"full"}
								variant={"link"}
								cursor={"pointer"}
								minW={0}
							>
								<CurrentUserPicture size={"sm"} />
							</MenuButton>
							<MenuList>
								<>
									<MenuItem>{`Logged in as ${fullName} `}</MenuItem>
									<MenuItem>
										<NavLink to={`/users/${userId}`}>Profile</NavLink>
									</MenuItem>
									<MenuDivider />
									<Flex justify={"flex-end"} pr={2}>
										<Button
											size={"sm"}
											variant="ghost"
											colorScheme={"gray"}
											rightIcon={<UnlockIcon />}
											onClick={() => {
												logout();
												navigate("/login");
												navigate(0);
											}}
										>
											Logout
										</Button>
									</Flex>
								</>
							</MenuList>
						</Menu>
					) : (
						<Button variant={"solid"} colorScheme="blue" size="sm">
							<NavLink to="/login">Login</NavLink>
						</Button>
					)}
				</Flex>
			</Flex>
		</Box>
	);
}

export default Navbar;
