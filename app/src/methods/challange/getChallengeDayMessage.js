import { arabicNumsNames } from "../../consts"
import { convertToGMTPlus3, formatDate, isSameDay } from "../../util"

export const getChallengeDayMessage = (activeChallenge) => {
	const isSuccess = (todayTime, challengeTime, date) => {
		return (
			isSameDay(new Date(date), convertToGMTPlus3(new Date())) && todayTime >= challengeTime * 60
		)
	}
	const statusMessage = activeChallenge.users
		.sort((a, b) => b.days.at(-1)?.todayTime - a.days.at(-1)?.todayTime)
		.reduce((acc, userDay, i) => {
			const currentDay = userDay.days?.find((day) => day.date === formatDate(new Date()))
			const isUserSuccess = currentDay
				? isSuccess(currentDay.todayTime, activeChallenge.challengeTime, currentDay.date)
				: false
			acc += userStateMessage(
				i,
				userDay.name,
				userDay.days,
				activeChallenge.challengeTime,
				isUserSuccess
			)
			return acc
		}, initMessage(activeChallenge.users[0].days.length - 1))
	return statusMessage
}

const initMessage = (dayNum) => `.                 نتائج التحدي لليوم ${arabicNumsNames[dayNum]}: 

`

const userStateMessage = (i, username, days, challengeTime, isSuccess) => {
	const rank = i + 1
	const rankText = isSuccess ? getChallengeRank(rank) : rank
	const isSuccessMessage = getChallengeStateMessage(isSuccess)
	return `${rankText}- ${username} ( ${isSuccessMessage} ) 
${getDaysMessage(days, challengeTime)}

`
}

const getDaysMessage = (days, challengeTime) => {
	const message = days.reduce((acc, day, i) => {
		const isUserSuccess = day.todayTime >= challengeTime * 60
		acc += getDayMessage(i, isUserSuccess)
		return acc
	}, "")
	return message
}

const getDayMessage = (dayNum, isSuccess) => {
	return `      اليوم ${arabicNumsNames[dayNum]} : ${isSuccess ? "فلح ✔" : "فشل ✖"}\n`
}

export const getChallengeRank = (rank) =>
	rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank

export const getChallengeStateMessage = (isSuccess) => (isSuccess ? "لقد نجح ✅" : "لقد فشل 🤣❌")
