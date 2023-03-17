import { Avatar } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";

function CurrentUserPicture({ size }) {
	const user = useSelector(selectCurrentUser);
	if (!user) return;
	const { firstName, lastName, picture } = user;
	const fullName = `${firstName} ${lastName || ""}`;
	return (
		<Avatar
			name={fullName}
			className="profile-pic"
			src={
				picture ? `${import.meta.env.VITE_BASE_URL}/pictures/${picture}` : ""
			}
			size={size}
		/>
	);
}

export default CurrentUserPicture;
