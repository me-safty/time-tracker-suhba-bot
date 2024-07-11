import bot from "../bot";
import { hamzaId, ranks } from "../consts";
import { getById } from "../db/getById";
import { userNotRegisterMessage } from "./addTime";
import {
	convertToGMTPlus3,
	formatDate,
	getArabicDayName,
	getHigriDate,
	getMessageInfo,
	getTimeByHours,
	getTodayTime,
	sendErrorMessage
} from "../util";

export const showStatus = async (msg) => {
	const {
		chatId,
		name,
		userId
	} = getMessageInfo(msg)
	try {
		const user = await getById(userId)
		if (user) {
			const todayTime = getTodayTime(user)
			bot.sendMessage(chatId, statusMessage({
				userId,
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
		sendErrorMessage(chatId);
	}
}

const statusMessage = ({userId, name, todayTime, allTime, rankName}) => {
const todayDateGMT3 = convertToGMTPlus3(new Date())
const arabicTodayName = getArabicDayName(todayDateGMT3.getDay())
	return `<b>الإحصائيات حول الأخ </b>${name}
<b>${formatDate()} : ${arabicTodayName}</b>
<b>${getHigriDate()} : ${arabicTodayName}</b>

<b>الانجاز اليوم:</b> ${getTimeByHours(todayTime)}

<strong>الإنجاز منذ دخولك المجموعة: </strong>${getTimeByHours(allTime)}

<strong>الرتبة: </strong>${
	userId === hamzaId
		? "امير المؤمنين"
		: rankName
	}

.`
}