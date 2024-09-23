import { client } from "../../sanityClient"
import { formatDate } from "../../util"

export const createChallenge = async (challengeTime, challengeDays) => {
	await client.create({
		_type: "challenge",
		challengeId: formatDate(),
		isFinished: false,
		challengeDays,
		challengeTime,
		users: [],
	})
}
