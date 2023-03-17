import { Text } from "@chakra-ui/react";
import { parseISO, formatDistanceToNow } from "date-fns";

const TimeAgo = ({ timestamp }) => {
	let timeAgo = "";
	if (timestamp) {
		const date = parseISO(timestamp);
		const timePeriod = formatDistanceToNow(date);
		timeAgo = `${timePeriod} ago`;
	}

	return <Text fontSize={"xs"}>&#183; {timeAgo}</Text>;
};
export default TimeAgo;
