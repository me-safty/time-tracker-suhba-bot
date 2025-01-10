import { client } from "../../sanityClient"

export const getActiveChallenge = async (enableTodayChallengeCheck = true) => {
	const activeChallenge = await client.fetch(`*[_type == 'challenge' && !isFinished][0]`)
	if (enableTodayChallengeCheck && activeChallenge) {
		const activeChallengeDateImMS = new Date(activeChallenge?.challengeId).getTime()
		if (new Date().getTime() < activeChallengeDateImMS) {
			return null
		} else {
			return activeChallenge
		}
	} else {
		return activeChallenge
	}
}