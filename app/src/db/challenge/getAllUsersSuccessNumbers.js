import { client } from "../../sanityClient"

export const getAllUsersSuccessNumbers = async () => {
	return await client.fetch(`*[_type == 'user']{id, name, "challengeSuccessNumber": count(*[_type == 'challenge' && isFinished && challengeDays > 0].users[userId == ^.id && isSuccess == true])}`)
}
