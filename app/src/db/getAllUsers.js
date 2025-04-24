import { client } from "../sanityClient"

export const getAllUsers = async () => {
	const users = await client.fetch(`*[_type == 'user'] | order(allTime desc) {
		name,
		allTime,
		todayTime,
		lastTimeEntryDate,
		id,
	}`)
	return users
}