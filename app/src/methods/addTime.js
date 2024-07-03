import bot from "../bot";
import { getById } from "../db/getById";
import { client } from "../sanityClient";
import { formatDate, getRank, isSameDay } from "../util";

export const addTime = async (msg, match) => {
	const chatId = msg.chat.id;
	const value = parseInt(match[1]);
	const {
		id
	} = msg.from
	if (!isNaN(value) || value.length) {
		try {
			const user = await getById(id)
			if (user) {
				const todayTime = isSameDay(
					new Date(user.lastTimeEntryDate),
					new Date()
				)
					? user.todayTime + value
					: value
				const allTime = user.allTime + value
				const {
					rankCode,
					rankName,
				} = getRank(allTime)
				const hasNewRank = user.rankCode !== +rankCode
				const randomMessage = Math.floor(Math.random() * 4) === 0 ? `جزاك الله خيرا يا ايها${rankName}` : ""
				const addTimeMessage = `<strong>إنجازك اليوم: ${todayTime}د
				
				${hasNewRank
					? newRankMessage(rankName)
					: ''}

				${randomMessage}</strong>
				`
				await client.createOrReplace({
					...user,
					allTime,
					rankCode: +rankCode,
					lastTimeEntryDate: formatDate(new Date()),
					todayTime,
				})
				bot.sendMessage(chatId, addTimeMessage, {
					parse_mode: "HTML"
				})
			}
			else {
				bot.sendMessage(chatId, userNotRegisterMessage, {
					parse_mode: "HTML"
				});
			}
		} catch (error) {
			console.error('Sanity write error:', error);
			bot.sendMessage(chatId, 'شئ ما خاطئ من فضلك حاوب مجددا');	
		}
	} else {
		bot.sendMessage(chatId, 'طريقه الاستغدام اكتب /إضافة_جلسة ثم عدد الدقائق');
	}
}

export const userNotRegisterMessage = `.
<strong>
المستغدم غير مسجل (:

للتسجيل اكتب /تسجيل_بالبوت ثم حاول مجددا
</strong>
.`

const newRankMessage = (rankName) => `مبارك تمت ترقيتك الي (${rankName}) 🎉`