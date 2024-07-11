import { addUserToChallenge } from "../../db/challenge/addUserToChallenge";
import { getActiveChallenge } from "../../db/challenge/getActiveChallenge";
import { client } from "../../sanityClient";
import { sendTeleMessage,  sendErrorMessage, getMessageInfo, isAdmin } from "../../util";
import { noActiveChallengeMessage } from "./joinChallenge";

export const endChallengeDay = async (msg) => {
	const {
		chatId,
		userId,
		name
	} = getMessageInfo(msg)
	try {

		/*
		
		get active users

		xx =>	add users today time in the challenge whit the date of the day

		check if the user is success in the challenge or not

		send today status message to the chat

		*/








		const activeChallenge = await getActiveChallenge()
		if (!activeChallenge) {
			return sendTeleMessage({
				chatId,
				value: noActiveChallengeMessage
			})
		}
		
		const challengeUsers = activeChallenge?.users ?? []
		const challengeUsersIds = challengeUsers?.map(user => user.userId)

		const usersDays = await client.fetch(`*[_type == "user" && id in $challengeUsersIds] {
				todayTime,
				"date": lastTimeEntryDate
			}`
			,
			{
				challengeUsersIds
			}
		)

		if (!challengeUsersIds.includes(userId)) {
			await addUserToChallenge(activeChallenge._id, userId, name)
			sendTeleMessage({
				chatId,
				value: "تم التسجيل في التحدي"
			})
		}
		else {
			sendTeleMessage({
        chatId,
        value: "المستغدم مسجل في التحدي بالفعل"
      })
		}
	} catch (error) {
		console.error('Sanity write error:', error);
		sendErrorMessage(chatId);
	}
}

// export const challengeCreatedMessage = (challengeTime) => `.

// خطوات النور تبدأ من هنا ..

// حيث تقليب الصّفحات، وخطُّ الكلمات، وصناعة الهوامش ..

// قم لنرصف الطّريق معًا..

// فالصّاحب في هذا المشوار دليل.. واستعن بمولاكَ فالاستعانة به أمّ الطّريق!



// تم بدأ التحدي عدد الساعات المطلوبه في اليوم => ${challengeTime} ساعات

// .
// `

// export const activeChallengesMessage = `.

// هناك تحدي نشط بالفعل

// .
// `