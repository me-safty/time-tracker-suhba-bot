import { getArabicDayName } from "./util"

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
  550: "مُشير 🔱"
}

export const arabicDays = [
	"الأحد",
	"الاثنين",
	"الثلاثاء",
	"الأربعاء",
	"الخميس",
	"الجمعة",
	"السبت"
]

export const botCommands = {
  addTime: "#إضافة_جلسة (عدد الدقائق)",
  register: "#تسجيل_بالبوت",
  showStatus: "#عرض_إحصائياتي",
  showCommands: "#عرض_الأوامر",
  showAllUsers: "#عرض_جميع_الإحصائيات"
}

export const commands = {
  addTime: /#إضافة_جلسة (.+)/,
  register: /#تسجيل_بالبوت/,
  showStatus: /#عرض_إحصائياتي/,
  showCommands: /#عرض_الأوامر/,
  showAllUsers: /#عرض_جميع_الإحصائيات/,
  sendMessage: /#ارسل (.*)/
}

export const mohamedSaftyId = 1273850613
export const hamzaId = 6187883815

export const arabicTodayName = getArabicDayName(new Date().getDay())