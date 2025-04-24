import { getAllUsersSuccessNumbers } from "../db/challenge/getAllUsersSuccessNumbers"
import { getChallengeRank } from "./challange/getChallengeDayMessage"
import { isLegalChat, sendTeleMessage } from "../util"

export const showSuccessChallengeRanks = async (msg) => {
  const chatId = msg.chat.id
  if (!isLegalChat(chatId)) return
  try {
    const users = await getAllUsersSuccessNumbers()
    if (!users || users.length === 0) {
      return sendTeleMessage({
        chatId,
        value: "لا يوجد مستخدمون أتموا تحديات بنجاح بعد."
      })
    }
    const sorted = users
      .filter(user => user.challengeSuccessNumber > 0)
      .sort((a, b) => b.challengeSuccessNumber - a.challengeSuccessNumber)
    const message = sorted.map((user, idx) => `
${getChallengeRank(idx + 1)}- الأخ ${user.name || user.id} (${user.challengeSuccessNumber} تحدي ناجح)`
    ).join("\n")
    sendTeleMessage({
      chatId,
      value: `<b>ترتيب التحديات المكتملة: 🏆</b>\n${message}`
    })
  } catch (e) {
    sendTeleMessage({
      chatId,
      value: "حدث خطأ أثناء جلب ترتيب التحديات."
    })
  }
}
