import { Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer";
import Navbar from "./navbar/Navbar";
import ScrollToTop from "./ScrollToTop";

function Layout() {
	return (
		<>
			<ScrollToTop/>
			<Navbar />
			<Container minH={"100vh"} maxW="full" px={0}>
				<Outlet />
			</Container>
			<Footer />
		</>
	);
}

export default Layout;
