import bot from "../bot";
import { botCommands, commands } from "../util";

export const showCommands = async (msg) => {
	const chatId = msg.chat.id;
	const commands = Object.values(botCommands).reduce((acc, command) => {
		return acc + command + "\n\n"
	}, '')
	bot.sendMessage(chatId, "<strong>" + commands + "</strong>\n.")	
}