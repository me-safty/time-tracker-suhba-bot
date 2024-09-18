import { suhbaChatId } from "../../consts";
import { getActiveChallenge } from "../../db/challenge/getActiveChallenge";
import { client } from "../../sanityClient";
import { sendTeleMessage, sendErrorMessage, getMessageInfo, isAdmin, isSameDay, convertToGMTPlus3 } from "../../util";
import { noActiveChallengeMessage } from "./joinChallenge";
import { scheduleJob } from "node-schedule";

export const sendEndChallengeDay = async (chatId) => {
	try {
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
			return isSameDay(
				new Date(date),
				convertToGMTPlus3(new Date())
			) && todayTime >= challengeTime * 60
		}

		const activeChallengeWhitNewUsers = {
			...activeChallenge,
			users: challengeUsers.map((user) => {
				const challengeDay = usersDays.find((day) => day.id === user.userId)
				const isUserSuccess = isSuccess(
					challengeDay?.todayTime ?? 0,
					activeChallenge.challengeTime,
					challengeDay?.date
				)
				return isUserSuccess
					? {
							...user,
							days: [
								...user.days,
								{
									"_key": challengeDay?.todayTime ?? 0,
									todayTime: challengeDay?.todayTime ?? 0,
									date: challengeDay?.date
								}
							]
						}
					: user
			})
		}

		await client.createOrReplace(activeChallengeWhitNewUsers)

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

// export const endChallengeDay = async (msg) => {
// 	const {
// 		chatId,
// 		userId
// 	} = getMessageInfo(msg)
// 	const isUserAdmin = await isAdmin(chatId, userId)
// 	if (!isUserAdmin) {
// 		return sendTeleMessage({
// 			chatId,
// 			value: notAdminMessage
// 		})
// 	}
// 	try {
// 		await sendEndChallengeDay(chatId)
// 	} catch (error) {
// 		console.error('Sanity write error:', error);
// 		sendErrorMessage(chatId);
// 	}
// }

export const autoEndChallengeDay = async () => {
	const activeChallenge = await getActiveChallenge()
	if (activeChallenge) {
		return scheduleJob( {
			hour: 23,
			minute: 17,
			second: 0,
			tz: 'Europe/Istanbul'
		}, () => {
			// sendEndChallengeDay(suhbaChatId)
			sendTeleMessage({
				suhbaChatId,
				value: "test"
			})
			// sendEndChallengeDay("-1002268002533")
		})
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