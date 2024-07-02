import bot from "../bot";
import { getById } from "../db/getById";
import { client } from "../sanityClient";
import { formatDate, isSameDay } from "../util";

export const addTime = async (msg, match) => {
	const chatId = msg.chat.id;
	const value = parseInt(match[1]);
	const {
		id,
	} = msg.from
	if (!isNaN(value)) {
		try {
			const user = await getById(id)
			if (user) {
				const todayTime = isSameDay(
					new Date(user.lastTimeEntryDate),
					new Date()
				)
					? user.todayTime + value
					: value
				await client.createOrReplace({
					...user,
					allTime: user.allTime + value,
					rankCode: user.rankCode,
					lastTimeEntryDate: formatDate(new Date()),
					todayTime,
				})
				bot.sendMessage(chatId, `إنجازك اليوم: ${todayTime}د`)
			}
			else {
				bot.sendMessage(chatId, addError);
			}
		} catch (error) {
			console.error('Sanity write error:', error);
			bot.sendMessage(chatId, 'Failed to track value');	
		}
	} else {
		bot.sendMessage(chatId, 'Usage: /add <value>');
	}
}

const addError = `.

المستغدم غير مسجل (:

للتسجيل اكتب /register ثم حاول مجددا

.`
