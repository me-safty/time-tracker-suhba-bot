import { client } from "../../sanityClient"

export const checkActiveChallenge = async () => {
	const activeChallengesCount = await client.fetch(`count(*[_type == 'challenge' && !isFinished])`)
	return activeChallengesCount === 0
}