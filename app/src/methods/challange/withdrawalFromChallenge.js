import { getActiveChallenge } from "../../db/challenge/getActiveChallenge"
import { deleteUserFromChallenge } from "../../db/challenge/removeUserFromChallenge"
import { messages } from "../../messages"
import { sendTeleMessage, sendErrorMessage, getMessageInfo, isLegalChat } from "../../util"

export const withdrawalFromChallenge = async (msg) => {
	const { chatId, userId } = getMessageInfo(msg)
	if (!isLegalChat(chatId)) return
	try {
		const activeChallenge = await getActiveChallenge(false)
		if (!activeChallenge) {
			return sendTeleMessage({
				chatId,
				value: messages.noActiveChallengeMessage,
			})
		}

		const challengeUsersIds = activeChallenge?.users?.map((user) => user.userId)
		if (challengeUsersIds.includes(userId)) {
			await deleteUserFromChallenge(activeChallenge, userId)
			sendTeleMessage({
				chatId,
				value: withdrawalChallengeMessage,
			})
		} else {
			sendTeleMessage({
				chatId,
				value: userNotInChallengeMessage,
			})
		}
	} catch (error) {
		console.error("Sanity write error:", error)
		sendErrorMessage(chatId)
	}
}

const withdrawalChallengeMessage = `.

تم الانسحاب من التحدي

نراك في تحديات أخرى ان شاء الله


.`

const userNotInChallengeMessage = `.

عذراً ؛ انت غير مُسجل بالتحدي 😅

.`
