import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorElement from "./components/ErrorElement";
import Home from "./components/Home";
import Layout from "./components/Layout";
import CheckAuth from "./features/auth/CheckAuth";
import LoginPage from "./features/auth/LoginPage";
import Debate from "./features/debates/Debate";
import UserLayout from "./features/users/UserLayout";

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Layout />,
			errorElement: <ErrorElement/>,
			children: [
				{
					errorElement: <ErrorElement />,
					children: [
						{
							index: true,
							element: <Home />,
						},
						{
							path: "login",
							element: <LoginPage />,
						},
						{
							path: "debates/:debateId",
							element: <Debate />,
						},
						{
							element: <CheckAuth />,
							children: [
								{
									path: "users/:userId",
									element: <UserLayout />,
								},
							],
						},
					],
				},
			],
		},
	]);
	return <RouterProvider router={router} />;
}

export default App;
