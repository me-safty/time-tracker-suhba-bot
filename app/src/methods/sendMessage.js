import bot from "../bot";
import { notAdminMessage } from "../messages";
import { getMessageInfo, isAdmin, isLegalChat, sendErrorMessage, sendTeleMessage } from "../util";

export const sendMessage = async (msg, match) => {
	const {
		messageId,
		chatId,
		userId
	} = getMessageInfo(msg)
	if (!isLegalChat(chatId)) return
	const value = match[1]

	const isUserAdmin = await isAdmin(chatId, userId)
	if (!isUserAdmin) {
    return sendTeleMessage({
			chatId,
			value: notAdminMessage
		})
  }

	bot.deleteMessage(chatId, messageId).catch(() => {
		sendErrorMessage(chatId)
	})

	if (msg.reply_to_message) {
    const repliedMessageId = msg.reply_to_message.message_id;
		sendTeleMessage({
			chatId,
			value,
			messageId: repliedMessageId
		})
  } else {
		sendTeleMessage({
			chatId,
			value
		})
  }
}