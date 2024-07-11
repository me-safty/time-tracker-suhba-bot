import { client } from "../../sanityClient"

export const getActiveChallenge = async () => {
	const activeChallenge = await client.fetch(`*[_type == 'challenge' && !isFinished][0]`)
	return activeChallenge
}