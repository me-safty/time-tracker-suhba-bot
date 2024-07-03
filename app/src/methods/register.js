import bot from "../bot";
import { createUser } from "../db/cerateUser";
import { getById } from "../db/getById";

export const register = async (msg) => {
	const chatId = msg.chat.id;
	const {
		first_name: name,
		id,
	} = msg.from
	try {
		const user = await getById(id)
		if (user) {
			bot.sendMessage(chatId, youRegisterMessage, {
				parse_mode: "HTML"
			});
		}
		else {
			await createUser({
				id,
				name
			})
			bot.sendMessage(chatId, registerMessage, {
				parse_mode: "HTML"
			})
		}
	} catch (error) {
		console.error('Sanity write error:', error);
		bot.sendMessage(chatId, 'شئ ما خاطئ من فضلك حاوب مجددا');
	}
}

const registerMessage = `.
<strong>
قد تم تسجيلك ، أهلا وسهلا بك 
</strong>
.`

const youRegisterMessage = `.
<strong>
عذراً ؛ انت مُسجل بالبوت فعلاً 😅
</strong>
.`