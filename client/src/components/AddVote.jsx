import { Button, ButtonGroup } from "@chakra-ui/react";
import {
	BsHandThumbsDown,
	BsHandThumbsDownFill,
	BsHandThumbsUp,
	BsHandThumbsUpFill,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/authSlice";

function AddVote({ votes, onVote, size }) {
	const curUser = useSelector(selectCurrentUser);
	const curUserId = curUser?._id;
	let hasVoted = false;
	let vote = false;
	if (curUserId in votes) {
		hasVoted = true;
		vote = votes[curUserId];
	}
	const voteCount = Object.values(votes).reduce(
		(acc, vote) => {
			if (vote) acc.upvote++;
			else acc.downvote++;
			return acc;
		},
		{ upvote: 0, downvote: 0 }
	);
	const navigate = useNavigate();
	const location = useLocation();

	const handleVoteClick = (e) => {
		if (!curUser) {
			return navigate("/login", { state: { prev: location.pathname } });
		}
		const vote = e.currentTarget.id === "upvote";
		onVote(vote, curUserId);
	};

	return (
		<ButtonGroup isAttached variant={"outline"} size={size? size: "sm"}>
			<Button
				aria-label="upvote"
				id="upvote"
				onClick={handleVoteClick}
				leftIcon={
					hasVoted && vote ? <BsHandThumbsUpFill /> : <BsHandThumbsUp />
				}
			>
				{voteCount.upvote}
			</Button>
			<Button
				aria-label="downvote"
				id="downvote"
				onClick={handleVoteClick}
				leftIcon={
					hasVoted && !vote ? <BsHandThumbsDownFill /> : <BsHandThumbsDown />
				}
			>
				{voteCount.downvote}
			</Button>
		</ButtonGroup>
	);
}

export default AddVote;
