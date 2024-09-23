import { client } from "../../sanityClient"

export const deleteUserFromChallenge = async (challenge, userId) => {
	const newChallengeUsers = challenge.users.filter((user) => user.is === userId)
	try {
		await client.createOrReplace({
			...challenge,
			users: newChallengeUsers,
		})
	} catch (error) {
		console.error(error)
	}
}
