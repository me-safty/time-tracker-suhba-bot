import bot from "../bot";
import { getById } from "../db/getById";
import { arabicTodayName, formatDate, getHigriDate, getTimeByHours, ranks } from "../util";
import { userNotRegisterMessage } from "./addTime";

export const showStatus = async (msg) => {
	const chatId = msg.chat.id;
	const {
		first_name: name,
		id,
	} = msg.from
	try {
		const user = await getById(id)
		if (user) {
			bot.sendMessage(chatId, statusMessage({
				name,
				todayTime: user.todayTime,
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

const statusMessage = ({name, todayTime, allTime, rankName}) => {
	return `.
<strong>
الإحصائيات حول الأخ ${name}

${getHigriDate()} : ${arabicTodayName}

الانجاز اليوم: ${getTimeByHours(todayTime)}

الانجاز منذ دخولك المجموعة: ${getTimeByHours(allTime)}

الرتبة: ${rankName}
</strong>

.`	
}