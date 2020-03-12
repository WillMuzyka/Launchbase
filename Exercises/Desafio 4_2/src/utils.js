exports.calcAge = (timestamp) => {
	const birth = new Date(timestamp)
	const today = new Date()
	let age = today.getUTCFullYear() - birth.getFullYear()
	const month = today.getUTCMonth() - birth.getUTCMonth()
	const day = today.getUTCDate() - birth.getUTCDate()
	month < 0 ? age-- :
		month == 0 ? (today < 0 ? age-- : null) : null
	return age
}

exports.showDate = (timestamp, key) => {
	const newDate = new Date(timestamp)
	const year = newDate.getUTCFullYear()
	const month = `0${newDate.getUTCMonth() + 1}`.slice(-2)
	const date = `0${newDate.getUTCDate()}`.slice(-2)
	if (key) return `${date}/${month}/${year}`
	return `${year}-${month}-${date}`
}

exports.showLevel = (key) => {
	switch (key) {
		case "EC": return "Médio Completo"
		case "SI": return "Superior Incompleto"
		case "SC": return "Superior Completo"
		case "MI": return "Mestrado Incompleto"
		case "MC": return "Mestrado Completo"
		case "DI": return "Doutorado Incompleto"
		case "DC": return "Doutorado Completo"
	}
}

exports.classType = (key) => {
	switch (key) {
		case "P": return "Presencial"
		case "D": return "À distância"
	}
}