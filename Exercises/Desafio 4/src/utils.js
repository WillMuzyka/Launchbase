module.exports = {
	calcAge: (timestamp) => {
		const birth = new Date(timestamp)
		const today = new Date()
		let age = today.getUTCFullYear() - birth.getFullYear()
		const month = today.getUTCMonth() - birth.getUTCMonth()
		const day = today.getUTCDate() - birth.getUTCDate()
		month < 0 ? age-- :
			month == 0 ? (today < 0 ? age-- : null) : null
		return age
	},

	showDate: (timestamp) => {
		const newDate = new Date(timestamp)
		const year = newDate.getUTCFullYear()
		const month = `0${newDate.getUTCMonth() + 1}`.slice(-2)
		const date = `0${newDate.getUTCDate()}`.slice(-2)
		return `${year}-${month}-${date}`
	},

	showLevel: (key) => {
		switch (key) {
			case "EC": return "Médio Completo"
			case "SI": return "Superior Incompleto"
			case "SC": return "Superior Completo"
			case "MI": return "Mestrado Incompleto"
			case "MC": return "Mestrado Completo"
			case "DI": return "Doutorado Incompleto"
			case "DC": return "Doutorado Completo"
		}
	},

	classType: (key) => {
		switch (key) {
			case "P": return "Presencial"
			case "D": return "À distância"
		}
	},

	showGrade: (year) => {
		const level = year.slice(0, 1)
		switch (level) {
			case "F": return `Fundamental: ${year.slice(-1)}º ano`
			case "M": return `Médio: ${year.slice(-1)}º ano`
			default: return "Ano não cadastrado"
		}
	},
}