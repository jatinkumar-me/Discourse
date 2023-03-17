import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

function PostSkeleton() {
	return (
		<Box padding="6">
			<SkeletonCircle size="10" />
			<SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="3" />
		</Box>
	);
}

export default PostSkeleton;
