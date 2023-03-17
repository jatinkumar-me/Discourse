import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { persistor, store } from "./app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { theme } from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate persistor={persistor} loading={null}>
				<ChakraProvider theme={theme}>
					<App />
					<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				</ChakraProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>
);
