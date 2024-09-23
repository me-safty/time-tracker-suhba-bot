import { client } from "../../sanityClient"

export const getNumberOfSuccessChallengesForUser = async (id) => {
	const activeChallenge = await client.fetch(
		`count(*[_type == 'challenge' && isFinished && challengeDays > 0].users[userId == $id && isSuccess == true])`,
		{
			id,
		}
	)
	return activeChallenge
}
