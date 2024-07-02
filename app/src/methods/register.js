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
			bot.sendMessage(chatId, 'المستغدم مسجل بالفعل');
		}
		else {
			await createUser({
				id,
				name
			})
			bot.sendMessage(chatId, `تم التسجيل بنجاج :)`)
		}
	} catch (error) {
		console.error('Sanity write error:', error);
		bot.sendMessage(chatId, 'شئ ما خاطئ من فضلك حاوب مجددا');
	}
}