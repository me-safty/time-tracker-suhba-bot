import { botCommands } from "../consts";
import { sendTeleMessage } from "../util";

export const showCommands = async (msg) => {
	const chatId = msg.chat.id;
	const commands = Object.values(botCommands).reduce((acc, command) => {
		return acc + command + "\n\n"
	}, '')
	sendTeleMessage({
		chatId,
		value: commands
	})
}