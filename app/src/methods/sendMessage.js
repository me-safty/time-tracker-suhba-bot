import bot from "../bot";

export const sendMessage = async (msg, match) => {
	const chatId = msg.chat.id;
	const messageId = msg.message_id;
	const value = match[1]

	bot.deleteMessage(chatId, messageId).catch((error) => {
		console.error('Failed to delete message:', error);
	});

	if (msg.reply_to_message) {
    const repliedMessageId = msg.reply_to_message.message_id;
    bot.sendMessage(chatId, value, { reply_to_message_id: repliedMessageId });
  } else {
		bot.sendMessage(chatId, value);	
  }
}