import { client } from "../../sanityClient"

export const getMyRankFromLeaderBoard = async (userId) => {
	const users = await client.fetch(`*[_type == 'user'] | order(allTime desc) {
		id,
		allTime
	}`)
	const userIndex = users.findIndex((user) => user.id === userId)
	const minsToNextRank = userIndex > 0
		? (users?.[userIndex - 1]?.allTime ?? 0) - (users?.[userIndex]?.allTime ?? 0)
		: undefined
	return {
		userRank: userIndex + 1,
		minsToNextRank
	}
}
