import bot from "../bot";
import { getById } from "../db/getById";
import {
	arabicTodayName,
	formatDate,
	getHigriDate,
	getTimeByHours,
	hamzaId,
	isSameDay,
	ranks
} from "../util";
import { userNotRegisterMessage } from "./addTime";

export const showStatus = async (msg) => {
	const chatId = msg.chat.id;
	const {
		first_name: name,
		last_name,
		id,
	} = msg.from
	try {
		const user = await getById(id)
		if (user) {
			const todayTime = isSameDay(
				new Date(user.lastTimeEntryDate),
				new Date()
			)
				? user.todayTime
				: 0
			bot.sendMessage(chatId, statusMessage({
				id,
				last_name,
				name,
				todayTime,
        allTime: user.allTime,
				rankName: ranks[user.rankCode]
			}), {
				parse_mode: "HTML"
			});
		}
		else {
			bot.sendMessage(chatId, userNotRegisterMessage)
		}
	} catch (error) {
		console.error('Sanity write error:', error);
		bot.sendMessage(chatId, 'شئ ما خاطئ من فضلك حاوب مجددا');
	}
}

const statusMessage = ({id, name, last_name, todayTime, allTime, rankName}) => {
	return `<b>الإحصائيات حول الأخ </b>${name} ${last_name ?? ''}
<b>${formatDate(new Date())} : ${arabicTodayName}</b>
<b>${getHigriDate()} : ${arabicTodayName}</b>

<b>الانجاز اليوم:</b> ${getTimeByHours(todayTime)}

<strong>الإنجاز منذ دخولك المجموعة: </strong>${getTimeByHours(allTime)}

<strong>الرتبة: </strong>${
	id === hamzaId
		? "امير المؤمنين"
		: rankName
	}

.`
}