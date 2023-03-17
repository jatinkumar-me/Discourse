import { Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer";
import Navbar from "./navbar/Navbar";

function Layout() {
	return (
		<>
			<Navbar />
			<Container minH={"100vh"} maxW="full">
				<Outlet />
			</Container>
			<Footer />
		</>
	);
}

export default Layout;
