import PostSkeleton from "~/components/loadingSkeleton/PostSkeleton";
import Argument from "./Argument";
import { useGetArgumentsQuery } from "./argumentSlice";

function ArgumentList({ debateId }) {
	const {
		data: argsData,
		isLoading,
		isError,
		isSuccess,
		error,
	} = useGetArgumentsQuery(debateId);

	let content;
	if (isLoading) {
		content = Array.from({length: 4}).map((val, idx) => <PostSkeleton key={idx}/>)
	} else if (isSuccess) {
		content = argsData.ids.map((argId) => <Argument key={argId} debateId={debateId} argumentId={argId} />);
	} else if (isError) {
		console.error("error in fetching arguments", error);
		content = <p>{error}</p>;
	}

	return <section>
      {content}
   </section>;
}

export default ArgumentList;
