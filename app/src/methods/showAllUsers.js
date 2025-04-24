import { getAllUsers } from "../db/getAllUsers";
import { notAdminMessage } from "../messages";
import {
	getMessageInfo,
	getTimeByHours,
	getTodayTime,
	isAdmin,
	isLegalChat,
	sendErrorMessage,
	sendTeleMessage
} from "../util";
import { getAllUsersSuccessRanks } from "../db/challenge/getAllUsersSuccessRanks";
import { getChallengeRank } from "./challange/getChallengeDayMessage";

export const showAllUsers = async (msg) => {
	const {
		chatId,
		userId,
		messageId
	} = getMessageInfo(msg)
	if (!isLegalChat(chatId)) return
	try {
		const isUserAdmin = await isAdmin(chatId, userId)
		if (!isUserAdmin) {
			return sendTeleMessage({
				chatId,
				value: notAdminMessage,
				messageId
			})
		}

		const users = await getAllUsers()
		const successRanks = await getAllUsersSuccessRanks();
		if (users) {
			const usersMessage = users
				.slice(0, 35)
				.filter((user) => user.allTime > 0)
				.reduce((acc, user, index) => {
					const todayTime = getTodayTime(user)
					const message = userMessage({
						index,
						name: user.name,
						allTime: user.allTime,
						todayTime,
						challengeSuccessRank: successRanks[user.id] || null
					})
					return acc + message
				}, '')
			sendTeleMessage({
				chatId,
				value: usersMessage,
				messageId
			})
		}
		else {
			sendErrorMessage(chatId)
		}
	} catch (error) {
		console.error('Sanity write error:', error);
		sendErrorMessage(chatId);
	}
}

export const userMessage = ({index, name, todayTime, allTime, challengeSuccessRank}) => {
	return `
${getChallengeRank(index + 1)}- الأخ ${name}
الانجاز اليوم: ${getTimeByHours(todayTime)}
الانجاز الكلي: ${getTimeByHours(allTime)}
ترتيب التحديات: ${challengeSuccessRank ? getChallengeRank(challengeSuccessRank) : 'لا يوجد'}
`
}
