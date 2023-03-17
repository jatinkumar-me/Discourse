import { Link } from "@chakra-ui/react";
import { Link as Navlink } from "react-router-dom";

function FullName({ firstName, lastName, userId, size }) {
	return (
		<Link as={Navlink} to={`/users/${userId}`} fontSize={size}>{`${firstName} ${
			lastName || ""
		}`}</Link>
	);
}

export default FullName;
