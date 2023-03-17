import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton, useColorMode } from "@chakra-ui/react";

export default function StyleColorMode() {
	const { toggleColorMode, colorMode } = useColorMode();

	return (
		<IconButton
      aria-label="toggle-dark-mode"
			variant="ghost"
			size="sm"
			onClick={toggleColorMode}
			icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
		/>
	);
}
