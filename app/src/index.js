import express from "express"
import bot from "./bot";
import { addTime } from "./methods/addTime";
import { register } from "./methods/register";
import { showStatus } from "./methods/showStatus";
import { showCommands } from "./methods/showCommands";
import { commands } from "./consts";
import { showAllUsers } from "./methods/showAllUsers";
import { sendMessage } from "./methods/sendMessage";
import { startChallenge } from "./methods/challange/startChallenge";
import { joinChallenge } from "./methods/challange/joinChallenge";
import { endChallengeDay } from "./methods/challange/endChallengeDay";
import { convertToGMTPlus3, formatDate, isSameDay } from "./util";
require('events').EventEmitter.defaultMaxListeners = 20;

require('dotenv').config();

const app = express();

app.get("/", (req, res) => {
    res.send("Bot is alive");
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

bot.onText(commands.addTime, (msg, match) => addTime(msg, match));
bot.onText(commands.register, (msg) => register(msg));
bot.onText(commands.showStatus, (msg) => showStatus(msg));
bot.onText(commands.showCommands, (msg) => showCommands(msg));
bot.onText(commands.showAllUsers, (msg) => showAllUsers(msg));
bot.onText(commands.sendMessage, (msg, match) => sendMessage(msg, match));
bot.onText(commands.startChallenge, (msg, match) => startChallenge(msg, match));
bot.onText(commands.joinChallenge, (msg) => joinChallenge(msg));
bot.onText(commands.endChallengeDay, (msg) => endChallengeDay(msg));

const datee = new Date().toLocaleString("en-US", {timeZone: "Asia/Riyadh"})

console.log(isSameDay(
    new Date(formatDate()),
    convertToGMTPlus3(new Date())
  ), new Date(), convertToGMTPlus3(new Date()), new Date(formatDate()), datee, new Date(datee))

module.exports = app