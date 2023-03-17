import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const theme = extendTheme({
	config: {
		initialColorMode: "dark",
		useSystemColorMode: false,
	},
	fonts: {
		body: "Mulish, system-ui, sans-serif",
		heading: "Cormorant Garamond, Georgia, serif",
		mono: "Fira Code, Menlo, monospace",
	},
	colors: {
		gray: {
			50: "#ebebeb",
			100: "#dedede",
			200: "#c9c9c9",
			300: "#b3b3b3",
			400: "#969696",
			500: "#787878",
			600: "#424242",
			700: "#303030",
			800: "#1f1f1f",
			900: "#141414",
		},
	},
	styles: {
		global: (props) => ({
			body: {
				bg: mode("blackAlpha.100", "black")(props),
				color: mode("gray.800", "whiteAlpha.700")(props),
			},
		}),
	},
});
