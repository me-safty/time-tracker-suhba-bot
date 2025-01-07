import { client } from "../../sanityClient"

export const getActiveChallenge = async () => {
	const activeChallenge = await client.fetch(`*[_type == 'challenge' && !isFinished][0]`)
	const activeChallengeDateImMS = new Date(activeChallenge.challengeId).getTime()
	if (new Date().getTime() < activeChallengeDateImMS) {
		return null
	} else {
		return activeChallenge
	}
}