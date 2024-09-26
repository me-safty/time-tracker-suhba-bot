import { botCommands } from "../consts";
import { isLegalChat, sendTeleMessage } from "../util";

export const showCommands = async (msg) => {
	const chatId = msg.chat.id;
	if (!isLegalChat(chatId)) return
	const commands = Object.values(botCommands).reduce((acc, command) => {
		return acc + command + "\n\n"
	}, '')
	sendTeleMessage({
		chatId,
		value: commands
	})
}