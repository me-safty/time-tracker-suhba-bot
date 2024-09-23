import { client } from "../../sanityClient"

export const getMyRankFromLeaderBoard = async (userId) => {
	const users = await client.fetch(`*[_type == 'user'] | order(allTime desc) {
		id
	}`)
	const userIndex = users.findIndex((user) => user.id === userId)
	return userIndex + 1
}
