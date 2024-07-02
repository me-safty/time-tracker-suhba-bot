import bot from "../bot";
import { getAllUsers } from "../db/getAllUsers";
import { getTimeByHours } from "../util";

export const showAllUsers = async (msg) => {
	const chatId = msg.chat.id;
	try {
		const users = await getAllUsers()
		if (users) {
			const usersMessage = users.reduce((acc, user, index) => {
				const message = userMessage({
					index,
					name: user.name,
					allTime: user.allTime,
					todayTime: user.todayTime,
				})
				return acc + message
			}, '')
			bot.sendMessage(chatId, usersMessage, {
				parse_mode: "HTML"
			})
		}
		else {
			bot.sendMessage(chatId, 'شئ ما خاطئ من فضلك حاوب مجددا')
		}
	} catch (error) {
		console.error('Sanity write error:', error);
		bot.sendMessage(chatId, 'شئ ما خاطئ من فضلك حاوب مجددا');
	}
}

export const userMessage = ({index, name, todayTime, allTime}) => {
	return `
<strong>
${index + 1}- الأخ ${name}
الانجاز اليوم: ${getTimeByHours(todayTime)}
الانجاز منذ دخولك المجموعة: ${getTimeByHours(allTime)}</strong>`	
}
