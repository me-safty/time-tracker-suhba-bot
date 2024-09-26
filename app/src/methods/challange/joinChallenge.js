import { addUserToChallenge } from "../../db/challenge/addUserToChallenge"
import { getActiveChallenge } from "../../db/challenge/getActiveChallenge"
import { sendTeleMessage, sendErrorMessage, getMessageInfo, isLegalChat } from "../../util"

export const joinChallenge = async (msg) => {
	const { chatId, userId, name } = getMessageInfo(msg)
	if (!isLegalChat(chatId)) return
	try {
		const activeChallenge = await getActiveChallenge()
		if (!activeChallenge) {
			return sendTeleMessage({
				chatId,
				value: noActiveChallengeMessage,
			})
		}
		const challengeUsersIds = activeChallenge?.users?.map((user) => user.userId) ?? []
		if (!challengeUsersIds.includes(userId)) {
			await addUserToChallenge(activeChallenge._id, userId, name)
			sendTeleMessage({
				chatId,
				value: joinChallengeMessage,
			})
		} else {
			sendTeleMessage({
				chatId,
				value: userInChallengeMessage,
			})
		}
	} catch (error) {
		console.error("Sanity write error:", error)
		sendErrorMessage(chatId)
	}
}

const joinChallengeMessage = `.

تم التسجيل في التحدي, ارنا عزيمة الرجال (:


.`

const userInChallengeMessage = `.

عذراً ؛ انت مُسجل بالتحدي فعلاً 😅

.`

export const noActiveChallengeMessage = `.

لا يوجد تحدي نشط

.`
