import { client } from "../sanityClient"

export const getById = async (id) => {
	const user = await client.fetch("*[_type == 'user' && id == $id][0]", {
		id
	})
	return user
}