import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectToken } from "./authSlice";

function CheckAuth() {
	const token = useSelector(selectToken);
	const location = useLocation();
	return token ? (
		<Outlet />
	) : (
		<Navigate to="/login" state={{ prev: location }} replace />
	);
}

export default CheckAuth;
