import { client } from "../../sanityClient"

export const addUserToChallenge = async (documentId, userId, name) => {
	const userChallenge = {
		_key: userId,
		userId,
		name,
		days: []
	}
	try {
		await client
			.patch(documentId)
			.setIfMissing({ users: [] })
			.append('users', [userChallenge])
			.commit() 
	} catch (error) {
		console.error(error)
	}
}