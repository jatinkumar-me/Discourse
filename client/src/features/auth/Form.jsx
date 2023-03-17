import { useState } from "react";
import { Formik, Field } from "formik";
import * as yup from "yup";
import { useLoginMutation, useRegisterMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLocation, useNavigate } from "react-router-dom";

import {
	Box,
	FormControl,
	FormLabel,
	Input,
	Checkbox,
	Button,
	VStack,
	FormErrorMessage,
	InputRightElement,
	InputGroup,
	Link,
	Text,
	useColorModeValue,
	IconButton,
	HStack,
	Spinner,
	Heading,
	Divider,
	useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const loginSchema = yup.object({
	email: yup.string().email("Invalid Email").required("Required"),
	password: yup.string().required("Required"),
});

const registerSchema = yup.object({
	firstName: yup.string().required("Required"),
	lastName: yup.string(),
	email: yup.string().email("Invalid Email").required("Required"),
	password: yup.string().required("Required"),
	location: yup.string(),
	occupation: yup.string(),
});

const initialLoginValues = {
	email: "",
	password: "",
};
const initialRegisterValues = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	location: "",
	occupation: "",
};

function Form() {
	const [formType, setFormType] = useState("login");
	const isLogin = formType === "login";
	const isRegister = formType === "register";
	const [showPassword, setShowPassword] = useState(false);

	const [login, { isLoading }] = useLoginMutation();
	const [register] = useRegisterMutation();
	const dispatch = useDispatch();

	const navigate = useNavigate();
	const { state } = useLocation();

	const toast = useToast(); 

	const handleFormSubmit = async (values, onSubmitProps) => {
		if (isLogin) handleLogin(values);
		else handleRegister(values);
		onSubmitProps.resetForm();
	};

	const handleLogin = async (values) => {
		try {
			const userData = await login(values).unwrap();
			dispatch(setCredentials(userData));
			if (state) navigate(state.prev);
			else navigate("/");
		} catch (err) {
			console.error(err);
			toast({
				title: "Error",
				description: err?.data.msg,
				status: "error",
			})
		}
	};
	const handleRegister = async (values) => {
		try {
			await register(values).unwrap();
			setFormType("login");
		} catch (err) {
			console.log(err);

		}
	};

	return (
		<Box p={10} rounded="2xl" bg={useColorModeValue("white", "gray.800")} boxShadow="xs">
			<Formik
				initialValues={isLogin ? initialLoginValues : initialRegisterValues}
				onSubmit={handleFormSubmit}
				validationSchema={isLogin ? loginSchema : registerSchema}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit,
					resetForm,
				}) => (
					<form onSubmit={handleSubmit}>
						<VStack spacing={4} align="flex-start">
							<Heading>{isLogin ? "Login" : "Register"}</Heading>
							<Text fontSize={"xs"}>
								{isLogin
									? "Login to access all of our features"
									: "Register to get started with Discourse"}
							</Text>
							<Divider />
							{isRegister && (
								<>
									<HStack alignItems={"flex-start"} w="full">
										<FormControl
											isInvalid={!!errors.firstName && touched.firstName}
										>
											<FormLabel htmlFor="firstName">First Name</FormLabel>
											<Field
												as={Input}
												type="text"
												id="firstName"
												name="firstName"
												value={values.firstName}
												onChange={handleChange}
												autoComplete="off"
												onBlur={handleBlur}
											/>
											<FormErrorMessage>{errors.firstName}</FormErrorMessage>
										</FormControl>

										<FormControl
											isInvalid={!!errors.lastName && touched.lastName}
										>
											<FormLabel htmlFor="lastName">Last Name</FormLabel>
											<Field
												as={Input}
												type="text"
												id="lastName"
												name="lastName"
												value={values.lastName}
												onChange={handleChange}
												autoComplete="off"
												onBlur={handleBlur}
											/>
											<FormErrorMessage>{errors.lastName}</FormErrorMessage>
										</FormControl>
									</HStack>

									<FormControl
										isInvalid={!!errors.location && touched.location}
									>
										<FormLabel htmlFor="location">Location</FormLabel>
										<Field
											as={Input}
											type="text"
											id="location"
											name="location"
											value={values.location}
											onChange={handleChange}
											autoComplete="off"
											onBlur={handleBlur}
										/>
										<FormErrorMessage>{errors.location}</FormErrorMessage>
									</FormControl>

									<FormControl
										isInvalid={!!errors.occupation && touched.occupation}
									>
										<FormLabel htmlFor="occupation">Occupation</FormLabel>
										<Field
											as={Input}
											type="text"
											id="occupation"
											name="occupation"
											value={values.occupation}
											onChange={handleChange}
											autoComplete="off"
											onBlur={handleBlur}
										/>
										<FormErrorMessage>{errors.occupation}</FormErrorMessage>
									</FormControl>
								</>
							)}
							<FormControl isInvalid={!!errors.email && touched.email}>
								<FormLabel htmlFor="email">Email Address</FormLabel>
								<Field
									as={Input}
									type="text"
									id="email"
									name="email"
									value={values.email}
									onChange={handleChange}
									autoComplete="off"
									onBlur={handleBlur}
								/>
								<FormErrorMessage>{errors.email}</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={!!errors.password && touched.password}>
								<FormLabel htmlFor="password">Password</FormLabel>
								<InputGroup>
									<Field
										as={Input}
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										value={values.password}
										onChange={handleChange}
										autoComplete="off"
										onBlur={handleBlur}
									/>
									<InputRightElement h={"full"}>
										<IconButton
											isRound
											variant="ghost"
											onClick={() => setShowPassword(!showPassword)}
											icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
										/>
									</InputRightElement>
								</InputGroup>
								<FormErrorMessage>{errors.password}</FormErrorMessage>
							</FormControl>

							<Field
								as={Checkbox}
								id="rememberMe"
								name="rememberMe"
								colorScheme="purple"
							>
								Remember me?
							</Field>

							<Button
								type="submit"
								colorScheme="blue"
								width="full"
								disabled={isLoading}
								leftIcon={isLoading ? <Spinner /> : false}
							>
								{!isLogin
									? `${isLoading ? "Registering you..." : "Register"}`
									: `${isLoading ? "Logging you in..." : "Login"}`}
							</Button>

							<Text align={"center"}>
								{isLogin
									? "Don't have an account? "
									: "Already have an account "}
								<Link
									color={"blue.500"}
									onClick={(e) => {
										e.preventDefault();
										if (isLogin) setFormType("register");
										else setFormType("login");
										resetForm();
									}}
								>
									{isLogin ? "Register" : "Login"}
								</Link>
							</Text>
						</VStack>
					</form>
				)}
			</Formik>
		</Box>
	);
}

export default Form;
