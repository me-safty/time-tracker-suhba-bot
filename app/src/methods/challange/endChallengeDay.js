import { suhbaChatId } from "../../consts"
import { getActiveChallenge } from "../../db/challenge/getActiveChallenge"
import { client } from "../../sanityClient"
import { sendTeleMessage, sendErrorMessage, getMessageInfo, isAdmin, formatDate } from "../../util"
import { getChallengeDayMessage } from "./getChallengeDayMessage"
import { getEndChallengeMessage } from "./getEndChallengeMessage"
import { noActiveChallengeMessage } from "./joinChallenge"
import { scheduleJob } from "node-schedule"

export const sendEndChallengeDay = async (chatId) => {
	try {
		const activeChallenge = await getActiveChallenge()
		if (!activeChallenge) {
			return sendTeleMessage({
				chatId,
				value: noActiveChallengeMessage,
			})
		}

		const challengeUsers = activeChallenge?.users ?? []
		const challengeUsersIds = challengeUsers?.map((user) => user.userId)

		const usersDays = await client.fetch(
			`*[
				_type == "user" &&
				id in $challengeUsersIds
			] | order(lastTimeEntryDate desc, todayTime desc) {
				id,
				name,
				todayTime,
				"date": lastTimeEntryDate
			}`,
			{
				challengeUsersIds,
			}
		)

		let isFinished
		const activeChallengeWhitNewUsers = {
			...activeChallenge,
			users: challengeUsers.map((user) => {
				const challengeDay = usersDays.find((day) => day.id === user.userId)
				const isSameDay = challengeDay?.date === formatDate(new Date())
				const days = [
					...user.days,
					{
						_key: `${formatDate(new Date())}`,
						todayTime: isSameDay
							? challengeDay?.todayTime ?? 0
							: 0,
						date: formatDate(new Date()),
					},
				]
				const isSuccessOnChallenge =
					days.length === activeChallenge.challengeDays &&
					days.every((day) => day.todayTime >= activeChallenge.challengeTime * 60)
				if (!isFinished) {
					isFinished = days.length === activeChallenge.challengeDays
				}
				return {
					...user,
					isSuccess: isSuccessOnChallenge,
					days,
				}
			}),
			isFinished,
		}

		await client.createOrReplace(activeChallengeWhitNewUsers)

		sendTeleMessage({
			chatId,
			value: getChallengeDayMessage(activeChallengeWhitNewUsers),
		})

		if (isFinished) {
			sendTeleMessage({
				chatId,
				value: getEndChallengeMessage(activeChallengeWhitNewUsers),
			})
		}
	} catch (error) {
		console.error("Sanity write error:", error)
		sendErrorMessage(chatId)
	}
}

export const autoEndChallengeDay = async () => {
	const activeChallenge = await getActiveChallenge()

	if (!activeChallenge) return

	return scheduleJob(
		{
			hour: 23,
			minute: 59,
			second: 55,
			tz: "Europe/Istanbul",
		},
		() => {
			sendEndChallengeDay(suhbaChatId)
			// sendEndChallengeDay("-1002268002533")
		}
	)
}

export const endChallengeDay = async (msg) => {
	const { chatId, userId } = getMessageInfo(msg)
	const isUserAdmin = await isAdmin(chatId, userId)
	if (!isUserAdmin) {
		return sendTeleMessage({
			chatId,
			value: notAdminMessage,
		})
	}
	try {
		await sendEndChallengeDay(chatId)
	} catch (error) {
		console.error("Sanity write error:", error)
		sendErrorMessage(chatId)
	}
}
