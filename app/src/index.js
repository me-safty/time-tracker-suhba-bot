import express from "express"
import bot from "./bot"
import { addTime } from "./methods/addTime"
import { register } from "./methods/register"
import { showStatus } from "./methods/showStatus"
import { showCommands } from "./methods/showCommands"
import { commands, suhbaChatId } from "./consts"
import { showAllUsers } from "./methods/showAllUsers"
import { sendMessage } from "./methods/sendMessage"
import { startChallenge } from "./methods/challange/startChallenge"
import { joinChallenge } from "./methods/challange/joinChallenge"
import { autoEndChallengeDay, endChallengeDay } from "./methods/challange/endChallengeDay"
import { deleteLastSession } from "./methods/deleteLastSession"
import { RecurrenceRule, scheduleJob } from "node-schedule"
import { sendTeleMessage } from "./util"
import { notAdminMessage } from "./messages"
require("events").EventEmitter.defaultMaxListeners = 20

require("dotenv").config()

const app = express()

app.get("/", (req, res) => {
	res.send("Bot is alive")
})

const port = process.env.PORT
app.listen(port, () => {
	console.log(`Server is running`)
})

bot.onText(commands.addTime, (msg, match) => addTime(msg, match))
bot.onText(commands.register, (msg) => register(msg))
bot.onText(commands.showStatus, (msg) => showStatus(msg))
bot.onText(commands.showCommands, (msg) => showCommands(msg))
bot.onText(commands.showAllUsers, (msg) => showAllUsers(msg))
bot.onText(commands.sendMessage, (msg, match) => sendMessage(msg, match))
bot.onText(commands.startChallenge, (msg, match) => startChallenge(msg, match))
bot.onText(commands.joinChallenge, (msg) => joinChallenge(msg))
bot.onText(commands.deleteLastSession, (msg) => deleteLastSession(msg))
bot.onText(commands.endChallengeDay, (msg) => endChallengeDay(msg))
// bot.onText(commands.withdrawalFromChallenge, (msg) => withdrawalFromChallenge(msg))

void (async () => {
	await autoEndChallengeDay()
		const rule = new RecurrenceRule()
		rule.hour = 18
		rule.minute = 20
		rule.second = 0
		rule.tz = "Europe/Istanbul"
	
		scheduleJob(rule, () => {
			sendTeleMessage({
				chatId: suhbaChatId,
				value: notAdminMessage
			})
		})
})()

module.exports = app
