import { getById } from "../db/getById";
import { messages } from "../messages";
import { client } from "../sanityClient";
import { convertToGMTPlus3, getMessageInfo, isLegalChat, isSameDay, sendErrorMessage, sendTeleMessage } from "../util";

export const deleteLastSession = async (msg) => {
	const {
		chatId,
		userId,
		messageId
	} = getMessageInfo(msg)

	if (!isLegalChat(chatId)) return

	try {
		const user = await getById(userId)
		if (user) {
			if (user.lastTimeEntry > 0) {
				const sameDay = isSameDay(
					new Date(user.lastTimeEntryDate),
					convertToGMTPlus3(new Date())
				)
				const allTimeWithoutLastSession = user.allTime - user.lastTimeEntry
				const todayTimeWithoutLastSession = user.todayTime - user.lastTimeEntry
				if (sameDay) {
					if (allTimeWithoutLastSession >= 0 && todayTimeWithoutLastSession >= 0) {
						await client.createOrReplace({
							...user,
							allTime: allTimeWithoutLastSession,
							todayTime: todayTimeWithoutLastSession,
							lastTimeEntry: 0
						})
					}
				}
				else {
					if (allTimeWithoutLastSession >= 0) {
						await client.createOrReplace({
							...user,
							allTime: allTimeWithoutLastSession,
							todayTime: 0,
							lastTimeEntry: 0
						})
					}
				}
				sendTeleMessage({
					chatId,
					value: messages.deleteSessionSuccess,
					messageId
				})
			}
			else {
				sendTeleMessage({
					chatId,
					value: messages.noLastSession,
					messageId
				})
			}
		}
		else {
			sendTeleMessage({
				chatId,
				value: messages.userNotRegisterMessage,
				messageId
			})
		}
	} catch (error) {
		console.error('Sanity write error:', error);
		sendErrorMessage(chatId);	
	}
}