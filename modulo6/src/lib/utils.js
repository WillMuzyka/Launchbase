module.exports = {
	date(timestamp) {
		const date = new Date(timestamp)
		const year = date.getUTCFullYear()
		const month = `0${date.getUTCMonth() + 1}`.slice(-2)
		const day = `0${date.getUTCDate()}`.slice(-2)

		const hours = `0${date.getUTCHours()}`.slice(-2)
		const minutes = `0${date.getUTCMinutes()}`.slice(-2)
		const seconds = `0${date.getUTCSeconds()}`.slice(-2)
		const milliseconds = date.getUTCMilliseconds()

		return ({
			iso: `${year}-${month}-${day}`,
			format: `${day}/${month}/${year}`,
			db: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
		})
	},
	formatPrice(price) {
		return new Intl.NumberFormat('pt-br', {
			style: "currency",
			currency: "BRL"
		}).format(price / 100)
	},
}