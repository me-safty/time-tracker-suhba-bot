import { client } from "../../sanityClient"
import { convertToGMTPlus3 } from "../../util"

export const getActiveChallenge = async (enableTodayChallengeCheck = true) => {
	const activeChallenge = await client.fetch(`*[_type == 'challenge' && !isFinished][0]`)
	if (enableTodayChallengeCheck && activeChallenge) {
		const activeChallengeDateImMS = new Date(activeChallenge?.challengeId).getTime()
		if (convertToGMTPlus3(new Date()).getTime() < activeChallengeDateImMS) {
			return null
		} else {
			return activeChallenge
		}
	} else {
		return activeChallenge
	}
}