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
	sendErrorMessage,
	sendTeleMessage,
} from "../util"
import { getMyRankFromLeaderBoard } from "../db/status"
import { getChallengeRank } from "./challange/getChallengeDayMessage"
import { getNumberOfSuccessChallengesForUser } from "../db/challenge/getNumberOfSuccessChallengesForUser"

export const showStatus = async (msg) => {
	const { chatId, name, userId } = getMessageInfo(msg)
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
			})
			sendTeleMessage({
				chatId,
				value: statusMessage,
				isBold: false,
			})
		} else {
			sendTeleMessage({
				chatId,
				value: userNotRegisterMessage,
			})
		}
	} catch (error) {
		console.error("Sanity write error:", error)
		sendErrorMessage(chatId)
	}
}

const getStatusMessage = async ({ userId, name, todayTime, allTime, rankName }) => {
	const todayDateGMT3 = convertToGMTPlus3(new Date())
	const arabicTodayName = getArabicDayName(todayDateGMT3.getDay())
	const challengeSuccessNum = await getNumberOfSuccessChallengesForUser(userId)

	let challengeSuccessNumMessage = ""
	if (challengeSuccessNum === 0) {
		challengeSuccessNumMessage = ` (: لا تزال في بداية الطريق`
	} else if (challengeSuccessNum <= 5) {
		for (let i = 0; i < challengeSuccessNum; i++) {
			challengeSuccessNumMessage += "🏆 "
		}
	} else {
		challengeSuccessNumMessage = `${challengeSuccessNum} 🏆`
	}

	return `<b>الإحصائيات حول الأخ </b>${name}
<b>${formatDate()} : ${arabicTodayName}</b>
<b>${getHigriDate()} : ${arabicTodayName}</b>

<b>الانجاز اليوم:</b> ${getTimeByHours(todayTime)}

<strong>الإنجاز منذ دخولك المجموعة: </strong>${getTimeByHours(allTime)}

<strong>الترتيب: </strong> ${getChallengeRank(await getMyRankFromLeaderBoard(userId))}

<strong>عدد التحديات الناجح بها : </strong> ${challengeSuccessNumMessage} 

<strong>الرقم القياسي اليومي: </strong> قريبا...

<strong>إحصائيات الأسبوع : </strong> قريبا... 

<strong>الرتبة: </strong>${userId === hamzaId ? "امير المؤمنين" : rankName}

.`
}
