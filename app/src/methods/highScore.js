import { getById } from "../db/getById"
import {
	getMessageInfo,
	sendErrorMessage,
	sendTeleMessage,
} from "../util"

export const highScore = async (msg) => {
	const { chatId, userId } = getMessageInfo(msg)
	try {
		const user = await getById(userId)
		if (user) {
			const message = `.
			
يحيا الإنجاز (:

			.`
			sendTeleMessage({
				chatId,
				value: message,
			})
		}
	} catch (error) {
		console.error("Sanity write error:", error)
		sendErrorMessage(chatId)
	}
}