import { convertToGMTPlus3, getArabicDayName } from "./util"
require('dotenv').config()

export const ranks = {
	0: "مواطن",
	50: "جندي شجاع",
	100: "رقيب",
	150: "ملازم اول",
	200: "نقيب ⭐",
	250: "رائد",
	300: "مقدم",
	350: "عقيد",
	400: "عميد",
	450: "لواء",
	500: "فريق",
	550: "مُشير",
}

export const arabicDays = [
	"الأحد",
	"الاثنين",
	"الثلاثاء",
	"الأربعاء",
	"الخميس",
	"الجمعة",
	"السبت",
]

export const botCommands = {
	addTime: "#إضافة_جلسة (عدد الدقائق)",
	register: "#تسجيل_بالبوت",
	showStatus: "#عرض_إحصائياتي",
	showCommands: "#عرض_الأوامر",
	showAllUsers: "#عرض_جميع_الإحصائيات",
	startChallenge: "#بدء_التحدي (عدد الساعات) (عدد الايام)",
	joinChallenge: "#مشاركة_بالتحدي",
	leaveChallenge: "#انسحاب_من_التحدي",
	endChallenge: "#انتهاء_التحدي",
	deleteLastSession: "#حذف_الجلسة",
}

export const commands = {
	addTime: /#إضافة_جلسة (.+)/,
	register: /#تسجيل_بالبوت/,
	showStatus: /#عرض_إحصائياتي/,
	showCommands: /#عرض_الأوامر/,
	showAllUsers: /#عرض_جميع_الإحصائيات/,
	sendMessage: /#ارسل ([\s\S]*)/,
	startChallenge: /#بدء_التحدي (.*)? (.*)?/,
	joinChallenge: /#مشاركة_بالتحدي/,
	leaveChallenge: /#انسحاب_من_التحدي/,
	endChallenge: /#انتهاء_التحدي/,
	endChallengeDay: /#انهاء_تحدي_اليوم/,
	deleteLastSession: /#حذف_الجلسة/,
	withdrawalFromChallenge: /#انسحاب_من_التحدي/,
}

export const mohamedSaftyId = 1273850613
export const hamzaId = 6187883815

export const todayDateGMT3 = () => convertToGMTPlus3(new Date())
export const arabicTodayName = () => getArabicDayName(todayDateGMT3().getDay())

export const suhbaChatId = process.env.MAIN_CHAT_ID
export const testingChatId = process.env.TEST_CHAT_ID

export const arabicNumsNames = [
	"الاول",
	"الثاني",
	"الثالث",
	"الرابع",
	"الخامس",
	"السادس",
	"السابع",
	"الثامن",
	"التاسع",
	"العاشر",
	"الحادي عشر",
	"الثاني عشر",
	"الثالث عشر",
	"الرابع عشر",
	"الخامس عشر",
	"السادس عشر",
	"السابع عشر",
	"الثامن عشر",
	"التاسع عشر",
	"العشرون",
]
