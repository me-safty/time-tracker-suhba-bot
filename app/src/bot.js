import TelegramBot from 'node-telegram-bot-api';
require('dotenv').config()

const token = process.env.TELEGRAM_API_TOKEN;

const bot = new TelegramBot(token, { polling: true })

export default bot