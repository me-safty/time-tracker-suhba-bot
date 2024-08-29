import { getActiveChallenge } from "../../db/challenge/getActiveChallenge";
import { notAdminMessage } from "../../messages";
import { client } from "../../sanityClient";
import { sendTeleMessage, sendErrorMessage, getMessageInfo, isAdmin, isSameDay, convertToGMTPlus3 } from "../../util";
import { noActiveChallengeMessage } from "./joinChallenge";

export const endChallengeDay = async (msg) => {
	const {
		chatId,
		userId
	} = getMessageInfo(msg)
	try {
		// const isUserAdmin = await isAdmin(chatId, userId)
		// if (!isUserAdmin) {
		// 	return sendTeleMessage({
		// 		chatId,
		// 		value: notAdminMessage
		// 	})
		// }

		const activeChallenge = await getActiveChallenge()
		if (!activeChallenge) {
			return sendTeleMessage({
				chatId,
				value: noActiveChallengeMessage
			})
		}
		
		const challengeUsers = activeChallenge?.users ?? []
		const challengeUsersIds = challengeUsers?.map(user => user.userId)

		const usersDays = await client.fetch(`*[
				_type == "user" &&
				id in $challengeUsersIds
			] | order(lastTimeEntryDate desc, todayTime desc) {
				id,
				name,
				todayTime,
				"date": lastTimeEntryDate
			}`
			,
			{
				challengeUsersIds
			}
		)

		const isSuccess = (todayTime, challengeTime, date) => {
			return todayTime >= challengeTime * 60
			//  isSameDay(
			// 	new Date(date),
			// 	convertToGMTPlus3(new Date())
			// ) && 
			// todayTime >= challengeTime * 60
		}

		const activeChallengeWhitNewUsers = {
			...activeChallenge,
			users: challengeUsers.map((user) => {
				const challengeDay = usersDays.find((day) => day.id === user.userId)
				const isUserSuccess = isSuccess(
					challengeDay?.todayTime ?? 0,
					activeChallenge.challengeTime * 60,
					challengeDay?.date
				)
				return isUserSuccess
					? {
							...user,
							days: [
								...user.days,
								{
									todayTime: challengeDay?.todayTime ?? 0,
									date: challengeDay?.date
								}
							]
						}
					: user
			})
		}

		// await client.createOrReplace(activeChallengeWhitNewUsers)

		const statusMessage = usersDays.reduce((acc, day, i) => {
			if (isSuccess(day.todayTime, activeChallenge.challengeTime, day.date)) {
				acc += userSuccessMessage(day.name, i + 1)
			} else {
				acc += userFailedMessage(day.name, i + 1)
			}
			return acc
		}, initMessage)

		sendTeleMessage({
			chatId,
      value: statusMessage
		})

	} catch (error) {
		console.error('Sanity write error:', error);
		sendErrorMessage(chatId);
	}
}


const initMessage = `.                 نتائج التحدي لليوم : 

`

const userSuccessMessage = (username, i) =>
`${i + "- " + username} ( لقد نجح بالتحدي ✅ ) 
نتيجة اليوم للتحدي : لقد نجح

`

const userFailedMessage = (username, i) => 
`${i + "- " + username} ( لقد فشل 🤣❌ ) 
نتيجة اليوم للتحدي : لقد فشل

`