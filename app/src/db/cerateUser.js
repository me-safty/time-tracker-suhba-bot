import { client } from "../sanityClient"
import { formatDate } from "../util"

export const createUser = async ({id, name}) => {
	await client.create({
		_type: "user",
		todayTime: 0,
		allTime: 0,
		id,
		name,
		rankCode: 0,
		lastTimeEntryDate: formatDate(),
		lastTimeEntry: 0,
		topRecordOnDay: 0
	})
}