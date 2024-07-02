import bot from "../bot";

export const sendMessage = async (msg, match) => {
	const chatId = msg.chat.id;
	const messageId = msg.message_id;
	const value = match[1]
	bot.deleteMessage(chatId, messageId).catch((error) => {
    console.error('Failed to delete message:', error);
  });
	bot.sendMessage(chatId, value);	
}