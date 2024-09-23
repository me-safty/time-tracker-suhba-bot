import { checkActiveChallenge } from "../../db/challenge/checkActiveChallenge"
import { createChallenge } from "../../db/challenge/createChallenge"
import { notAdminMessage } from "../../messages"
import {
	sendTeleMessage,
	sendErrorMessage,
	getMessageInfo,
	isAdmin,
} from "../../util"

export const startChallenge = async (msg, match) => {
	const { chatId, userId } = getMessageInfo(msg)
	const challengeTimeByHour = parseInt(match[1])
	const challengeDays = parseInt(match[2])
	try {
		const isUserAdmin = await isAdmin(chatId, userId)
		if (!isUserAdmin) {
			return sendTeleMessage({
				chatId,
				value: notAdminMessage,
			})
		}
		if (!challengeDays || !challengeTimeByHour) {
			return sendTeleMessage({
				chatId,
				value: `طريقه الاستخدام #بدء_التحدي (عدد الساعات) (عدد الايام)`,
			})
		}
		const noActiveChallenge = await checkActiveChallenge()
		if (noActiveChallenge) {
			await createChallenge(challengeTimeByHour, challengeDays)
			sendTeleMessage({
				chatId,
				value: challengeCreatedMessage(challengeTimeByHour, challengeDays),
			})
		} else {
			sendTeleMessage({
				chatId,
				value: activeChallengesMessage,
			})
		}
	} catch (error) {
		console.error("Sanity write error:", error)
		sendErrorMessage(chatId)
	}
}

export const challengeCreatedMessage = (challengeTime, challengeDays) => `.

خطوات النور تبدأ من هنا ..

حيث تقليب الصّفحات، وخطُّ الكلمات، وصناعة الهوامش ..

قم لنرصف الطّريق معًا..

فالصّاحب في هذا المشوار دليل.. واستعن بمولاكَ فالاستعانة به أمّ الطّريق!



تم بدأ التحدي عدد الساعات المطلوبه في اليوم => ${challengeTime} ساعات, لمده ${challengeDays} ايام

.
`

export const activeChallengesMessage = `.

هناك تحدي نشط بالفعل

.
`
