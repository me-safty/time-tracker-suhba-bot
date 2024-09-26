import { getById } from "../db/getById";
import { client } from "../sanityClient";
import { formatDate, getMessageInfo, getRank, getTodayTime, sendErrorMessage, sendTeleMessage } from "../util";

export const addTime = async (msg, match) => {
	const {
		chatId,
		userId,
	} = getMessageInfo(msg)

	const value = parseInt(match[1])

	if (value <= 0) {
		sendErrorMessage(chatId)
		return
	}

	if (!isNaN(value) || value.length) {
		try {
			const user = await getById(userId)
			if (user) {
				const todayTime = getTodayTime(user, value)	
				const allTime = user.allTime + value
				const {
					rankCode,
					rankName,
				} = getRank(allTime)
				const hasNewRank = user.rankCode !== +rankCode
				const topRecordOnDay = (user?.topRecordOnDay ?? 0) < todayTime
					? todayTime
					: user?.topRecordOnDay ?? 0
				// if (hasNewRank) {
				// 	await changeCustomTitle(chatId, userId, rankName)
				// }

				const randomMessage = Math.floor(Math.random() * 40) === 4
					? `جزاك الله خيرا يا ${rankName.split(" ")[0]} ${user.name.split(" ")[0]} `
					: ""
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
					lastTimeEntryDate: formatDate(),
					todayTime,
					lastTimeEntry: value,
					topRecordOnDay
				})
				sendTeleMessage({
					chatId,
					value: addTimeMessage,
					isBold: false
				})
			}
			else {
				sendTeleMessage({
					chatId,
					value: userNotRegisterMessage,
				})
			}
		} catch (error) {
			console.error('Sanity write error:', error);
			sendErrorMessage(chatId)
		}
	} else {
		sendTeleMessage({
			chatId,
			value: wrongValueMessage,
		})
	}
}

export const userNotRegisterMessage = `.

المستخدم غير مسجل (:

للتسجيل اكتب #تسجيل_بالبوت ثم حاول مجددا

.`

const newRankMessage = (rankName) => `مبارك تمت ترقيتك الي (${rankName}) 🎉`

const wrongValueMessage = 'طريقه الاستخدام اكتب #إضافة_جلسة ثم عدد الدقائق'