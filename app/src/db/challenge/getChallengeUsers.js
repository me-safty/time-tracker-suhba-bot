import { client } from "../sanityClient"

export const getChallengeUsers = async (id) => {
	const users = await await client.fetch("*[_type == 'challenge' && id == $id][0] {users}", {
		id
	})
	return users
}