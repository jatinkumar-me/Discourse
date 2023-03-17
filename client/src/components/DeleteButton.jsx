import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectCurrentUser } from "~/features/auth/authSlice";

function DeleteButton({ onDelete }) {
	const curUser = useSelector(selectCurrentUser);
	const location = useLocation();

	const handleClick = () => {
		if (!curUser) {
			return <Navigate to="/login" state={{ prev: location }} />;
		}
		onDelete();
	};

	return <button type="button" onClick={handleClick}></button>;
}

export default DeleteButton;
