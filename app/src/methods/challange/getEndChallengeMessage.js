import { getChallengeRank, getChallengeStateMessage } from "./getChallengeDayMessage"

export const getEndChallengeMessage = (activeChallenge) => {
	const statusEndChallengeMessage = activeChallenge.users
		.sort((a, b) => {
			const aTime = a.days.reduce((acc, day) => {
				acc += day.todayTime
				return acc
			}, 0)
			const bTime = b.days.reduce((acc, day) => {
				acc += day.todayTime
				return acc
			}, 0)
			return bTime - aTime
		})
		.reduce((acc, userDay, i) => {
			const isUserSuccess =
				userDay.days.length === activeChallenge.challengeDays &&
				userDay.days.every((day) => day.todayTime >= activeChallenge.challengeTime * 60)
			acc += userStateEndChallengeMessage(userDay.name, isUserSuccess, i)
			return acc
		}, initMessageEnd)

	return statusEndChallengeMessage
}

const initMessageEnd = `.                 نتائج التحدي : 

`

const userStateEndChallengeMessage = (username, isSuccess, i) => {
	const rank = i + 1
	const rankText = isSuccess ? getChallengeRank(rank) : rank
	const isSuccessMessage = getChallengeStateMessage(isSuccess)
	return `${rankText}- ${username} ( ${isSuccessMessage} )\n\n`
}
