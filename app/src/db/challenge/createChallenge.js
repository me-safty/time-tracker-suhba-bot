import { client } from "../../sanityClient"
import { formatDate } from "../../util"

export const createChallenge = async (challengeTime) => {
	await client.create({
		_type: "challenge",
		challengeId: formatDate(),
		isFinished: false,
		challengeTime,
		users: []
	})
}