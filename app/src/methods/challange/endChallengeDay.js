import { suhbaChatId } from "../../consts"
import { getActiveChallenge } from "../../db/challenge/getActiveChallenge"
import { client } from "../../sanityClient"
import { sendTeleMessage, sendErrorMessage, getMessageInfo, isAdmin, formatDate } from "../../util"
import { getChallengeDayMessage } from "./getChallengeDayMessage"
import { getEndChallengeMessage } from "./getEndChallengeMessage"
import { scheduleJob, RecurrenceRule } from "node-schedule"

export const sendEndChallengeDay = async (chatId) => {
	try {
		const activeChallenge = await getActiveChallenge()
		if (!activeChallenge) return
		const activeChallengeDateImMS = new Date(activeChallenge.challengeId).getTime()
		if (new Date().getTime() < activeChallengeDateImMS) return

		console.log(new Date())

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
				const userChallengeDay = usersDays.find((day) => day.id === user.userId)
				const isSameDay = userChallengeDay?.date === formatDate(new Date())
				const days = [
					...user.days,
					{
						_key: `${formatDate(new Date())}`,
						todayTime: isSameDay ? userChallengeDay?.todayTime ?? 0 : 0,
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

	const rule = new RecurrenceRule()
	rule.hour = 23
	rule.minute = 59
	rule.second = 55
	rule.tz = "Europe/Istanbul"

	scheduleJob(rule, () => {
		// sendEndChallengeDay("-1002268002533")
		sendEndChallengeDay(suhbaChatId)
	})
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
