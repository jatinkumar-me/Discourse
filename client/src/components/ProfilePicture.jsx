import { Avatar } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function ProfilePicture({ userId, fullName, size }) {
	return (
		<Link to={`/users/${userId}`}>
			<Avatar
				src={`${import.meta.env.VITE_BASE_URL}/users/${userId}/profile-pic`}
				name={fullName}
				size={size}
			/>
		</Link>
	);
}

export default ProfilePicture;
