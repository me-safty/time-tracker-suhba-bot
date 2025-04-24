import { getAllUsersSuccessNumbers } from "./getAllUsersSuccessNumbers";

export const getAllUsersSuccessRanks = async () => {
	const allUsersSuccessNumbers = await getAllUsersSuccessNumbers();
	const sortedBySuccess = allUsersSuccessNumbers.sort((a, b) => b.challengeSuccessNumber - a.challengeSuccessNumber);
	const successRanks = {};
  for (let i = 0; i < sortedBySuccess.length; i++) {
    const user = sortedBySuccess[i];
    if (user.challengeSuccessNumber <= 0) continue
    successRanks[user.id] = i + 1;
  }
	return successRanks;
};
