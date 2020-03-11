exports.calcAge = (timestamp) => {
	const today = new Date()
	const birthDate = new Date(timestamp)
	let age = today.getFullYear() - birthDate.getFullYear()
	const difMonth = today.getMonth() - birthDate.getMonth()
	const difDay = today.getDate() - birthDate.getDate()
	difMonth < 0 ? age-- :
		(difMonth == 0 ? (difDay < 0 ? age-- : null) : null)
	return age
}

exports.date = (timestamp) => {
	const date = new Date(timestamp)
	const year = date.getUTCFullYear()
	let month = `0${date.getUTCMonth() + 1}`.slice(-2)
	let day = `0${date.getUTCDate()}`.slice(-2)
	return (`${year}-${month}-${day}`)
}