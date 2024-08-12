import moment from "moment-hijri"
import { arabicDays, hamzaId, mohamedSaftyId, ranks } from "./consts";
import { errorMessage } from "./messages";
import bot from "./bot";

String.prototype.toArabicDigits= function(){
  const id = ['۰','۱','۲','٣','٤','٥','٦','۷','۸','۹'];
  return this.replace(/[0-9]/g, function(w) {
    return id[+w]
  });
}
export const formatDate = (date = new Date()) => {
  date = convertToGMTPlus3(date)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
export const isSameDay = (date1, date2) =>
	date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate();

export const getTimeByHours = (timeByMin) => {
  const hours = Math.floor(timeByMin / 60);
  const minutes = timeByMin % 60;
  return `${hours}h ${minutes}m`;
}

export const getHigriDate = (date = new Date()) => {
  date = convertToGMTPlus3(date)
  const m = moment(date);
  m.locale("ar")
  return m.format('iD - iMMMM - iYYYY هـ').toArabicDigits()
}

export const getArabicDayName = (dayOfWeek) => arabicDays[dayOfWeek]

export const getRank = (allTime) => {
  const hours = Math.floor(allTime / 60)
  const rankValues = Object.keys(ranks)
  if (hours >= rankValues[rankValues.length - 1]) {
    return {
      rankCode: rankValues[rankValues.length - 1],
      rankName: ranks[rankValues[rankValues.length - 1]]
    }
  }
  else {
    for (let i = 0; i < rankValues.length; i++) {
      if (hours >= +rankValues[i]) {
        continue
      }
      else {
        return {
          rankCode: rankValues[i - 1],
          rankName: ranks[rankValues[i - 1]]
        };
      }
    }
  }
}

export const isAdmin = async (chatId, userId) => {
  try {
    const chatAdmins = await bot.getChatAdministrators(chatId)
    const isAdmin = chatAdmins.some(admin => admin.user.id === userId)
    return isAdmin
  } catch {
    return false
  }
}

export const sendTeleMessage = ({
  chatId,
  value,
  messageId,
  isBold = true,
  options = {}
}) => {
  const messageOptions = {
    ...options,
    parse_mode: "HTML"
  }
  if (messageId) {
    messageOptions.reply_to_message_id = messageId
  }
  const message = isBold
    ? `<b>${value}</b>`
    : value
  bot.sendMessage(chatId, message, messageOptions);
}

export const getMessageInfo = (msg) => {
  const {
		first_name,
		last_name,
		id,
    username
	} = msg.from
  return {
    chatId: msg.chat.id,
    messageId: msg.message_id,
    userId: id,
    name: last_name
      ? `${first_name} ${last_name}`
      : first_name,
    first_name,
    last_name,
    username
  }
}

export const sendErrorMessage = (chatId) => {
  sendTeleMessage({
    chatId,
    value: errorMessage
  })
}

export const convertToGMTPlus3 = (date) => {
  const originalTime = date.getTime();
  const gmtPlus3Offset = 3 * 60 * 60 * 1000;
  const gmtPlus3Date = new Date(originalTime + gmtPlus3Offset);
  return gmtPlus3Date;
}

export const getTodayTime = (user, newValue = 0) => {
  return isSameDay(
    new Date(user.lastTimeEntryDate),
    convertToGMTPlus3(new Date())
  )
    ? user.todayTime + newValue
    : newValue
}

// export const changeCustomTitle = async (chatId, userId, rankName) => {
//   if (userId !== hamzaId && userId !== mohamedSaftyId) {
//     // const isUserAdmin = await isAdmin(chatId, userId)
//     // if (!isUserAdmin) {
//       // }
//       try {
//         await bot.promoteChatMember(chatId, userId, {
//           can_promote_members: false,
//           can_change_info: false,
//           can_post_messages: false,
//           can_edit_messages: false,
//           can_delete_messages: false,
//           can_invite_users: false,
//           can_restrict_members: false,
//           can_pin_messages: false,
//           can_manage_voice_chats: false,
//           is_anonymous: false
//         })
//         // await bot.setChatAdministratorCustomTitle(chatId, userId, rankName);
//       console.log("================================")
//     }
//     catch (error) {
//       console.log(error)
//     }
//   }
// }
