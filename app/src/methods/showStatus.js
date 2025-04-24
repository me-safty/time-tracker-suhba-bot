import { hamzaId, ranks } from "../consts"
import { getById } from "../db/getById"
import { userNotRegisterMessage } from "./addTime"
import {
	convertToGMTPlus3,
	formatDate,
	getArabicDayName,
	getHigriDate,
	getMessageInfo,
	getTimeByHours,
	getTodayTime,
	isLegalChat,
	sendErrorMessage,
	sendTeleMessage,
} from "../util"
import { getMyRankFromLeaderBoard } from "../db/status"
import { getChallengeRank } from "./challange/getChallengeDayMessage"
import { getNumberOfSuccessChallengesForUser } from "../db/challenge/getNumberOfSuccessChallengesForUser"
import { getAllUsersSuccessNumbers } from "../db/challenge/getAllUsersSuccessNumbers"

export const showStatus = async (msg) => {
	const {
		chatId,
		name,
		userId,
		messageId
	} = getMessageInfo(msg)

	if (!isLegalChat(chatId)) return

	try {
		const user = await getById(userId)
		if (user) {
			const todayTime = getTodayTime(user)
			const statusMessage = await getStatusMessage({
				userId,
				name,
				todayTime,
				allTime: user.allTime,
				rankName: ranks[user.rankCode],
				topRecordOnDay: user?.topRecordOnDay ?? 0
			})
			sendTeleMessage({
				chatId,
				value: statusMessage,
				isBold: false
			})
		} else {
			sendTeleMessage({
				chatId,
				value: userNotRegisterMessage,
				messageId
			})
		}
	} catch (error) {
		console.error("Sanity write error:", error)
		sendErrorMessage(chatId)
	}
}

const getStatusMessage = async ({ userId, name, todayTime, allTime, rankName, topRecordOnDay }) => {
	const todayDateGMT3 = convertToGMTPlus3(new Date())
	const arabicTodayName = getArabicDayName(todayDateGMT3.getDay())
	const {
		userRank: leaderBoardRank,
		minsToNextRank
	} = await getMyRankFromLeaderBoard(userId)
	const timeToNextRankMessage = minsToNextRank
		? ` | يتبقى ${getTimeByHours(minsToNextRank)} للترتيب التالي`
		: ""
	const challengeSuccessNum = await getNumberOfSuccessChallengesForUser(userId)

	const allUsersSuccessNumbers = await getAllUsersSuccessNumbers()
	const sortedBySuccess = allUsersSuccessNumbers.sort((a, b) => b.challengeSuccessNumber - a.challengeSuccessNumber)
	const userSuccessRank = sortedBySuccess.findIndex(u => u.id === userId) + 1

	let challengeSuccessNumMessage = ""
	if (challengeSuccessNum === 0) {
		challengeSuccessNumMessage = ` (: لا تزال في بداية الطريق`
	}
	else {
		challengeSuccessNumMessage = `🏆${challengeSuccessNum}x - الترتيب: ${getChallengeRank(userSuccessRank)}`
	}

	return `<b>الإحصائيات حول الأخ </b>${name}
<b>📆 ${formatDate()} : ${arabicTodayName}</b>
<b>🗓️ ${getHigriDate()} : ${arabicTodayName}</b>

<b>الانجاز اليوم:</b> ${getTimeByHours(todayTime)}

<strong>الإنجاز منذ دخولك المجموعة: </strong>${getTimeByHours(allTime)}

<strong>الترتيب: </strong> ${getChallengeRank(leaderBoardRank)}${timeToNextRankMessage}

<strong>التحديات المكتملة : </strong> ${challengeSuccessNumMessage} 

<strong>الرقم القياسي اليومي: </strong>${getTimeByHours(topRecordOnDay)}

<strong>إحصائيات الأسبوع : </strong> قريبا... 

<strong>الرتبة: </strong>${userId === hamzaId ? "امير المؤمنين" : rankName}`
}
