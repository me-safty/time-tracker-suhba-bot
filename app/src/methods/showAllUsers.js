import { getAllUsers } from "../db/getAllUsers";
import { notAdminMessage } from "../messages";
import {
	getMessageInfo,
	getTimeByHours,
	getTodayTime,
	isAdmin,
	sendErrorMessage,
	sendTeleMessage
} from "../util";

export const showAllUsers = async (msg) => {
	const {
		chatId,
		userId,
		messageId
	} = getMessageInfo(msg)
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
						topRecordOnDay: user?.topRecordOnDay ?? 0
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

export const userMessage = ({index, name, todayTime, allTime, topRecordOnDay}) => {
	return `

${index + 1}- الأخ ${name}
الانجاز اليوم: ${getTimeByHours(todayTime)}
الانجاز الكلي: ${getTimeByHours(allTime)}
الرقم القياسي: ${getTimeByHours(topRecordOnDay)}`
}
