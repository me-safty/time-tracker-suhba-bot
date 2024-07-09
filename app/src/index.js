import express from "express"
import bot from "./bot";
import { addTime } from "./methods/addTime";
import { register } from "./methods/register";
import { showStatus } from "./methods/showStatus";
import { showCommands } from "./methods/showCommands";
import { commands } from "./consts";
import { showAllUsers } from "./methods/showAllUsers";
import { sendMessage } from "./methods/sendMessage";
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

module.exports = app