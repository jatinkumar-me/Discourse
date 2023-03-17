import PostSkeleton from "~/components/loadingSkeleton/PostSkeleton";
import DebatesExcerpt from "./DebatesExcerpt";
import { useGetDebatesQuery } from "./debateSlice";

function Debates({ userId, sort_by }) {
	const params = {};
	if (userId) params.userId = userId;
	if (sort_by) params.sort_by = sort_by;
	const {
		data: debates,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetDebatesQuery(params);
	let content;
	if (isLoading) {
		content = Array.from({ length: 7 }).map((e, idx) => (
			<PostSkeleton key={idx} />
		));
	} else if (isSuccess) {
		// content =  JSON.stringify(
		// 		debates.ids.map((id) => ({
		// 			title: debates.entities[id].title,
		// 			createdAt: debates.entities[id].createdAt,
		// 		}))
		// 	)
		content = debates.ids.map((debateId) =>
			<DebatesExcerpt key={debateId} debateId={debateId} params={params} />
		);
	} else if (isError) {
		content = <p>{error.error}</p>;
	}

	return content;
}

export default Debates;
