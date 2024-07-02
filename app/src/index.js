import express from "express"
import bot from "./bot";
import { addTime } from "./methods/addTime";
import { register } from "./methods/register";

require('dotenv').config();

const app = express();

app.get("/", (req, res) => {
    res.send("Bot is alive");
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

bot.onText(/\/add (.+)/, (msg, match) => addTime(msg, match));
bot.onText(/\/register/, (msg) => register(msg));

module.exports = app;
