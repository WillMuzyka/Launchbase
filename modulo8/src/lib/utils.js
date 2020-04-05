module.exports = {
	date(timestamp) {
		const date = new Date(timestamp)
		const year = date.getFullYear()
		const month = `0${date.getMonth() + 1}`.slice(-2)
		const day = `0${date.getDate()}`.slice(-2)

		const hours = `0${date.getHours()}`.slice(-2)
		const minutes = `0${date.getMinutes()}`.slice(-2)
		const seconds = `0${date.getSeconds()}`.slice(-2)
		const milliseconds = date.getMilliseconds()

		return ({
			iso: `${year}-${month}-${day}`,
			show: `${day}/${month} às ${hours}h${minutes}`,
			format: `${day}/${month}/${year}`,
			db: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
		})
	},
	formatPrice(price) {
		return new Intl.NumberFormat('pt-BR', {
			style: "currency",
			currency: "BRL"
		}).format(price / 100)
			.replace(/,/g, ";")
			.replace(".", ",")
			.replace(/;/g, ".")
	},
	formatCpfCnpj(value) {
		value = value.replace(/\D/g, "")
		if (value.length > 14) value = value.slice(0, -1)

		if (value.length > 11) {
			value = value
				.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, "$1.$2.$3/$4-$5")
		} else {
			value = value
				.replace(/(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4")
		}
		return value
	},
	formatCep(value) {
		value = value.replace(/\D/g, "")
		if (value.length > 8) value = value.slice(0, -1)
		return value.replace(/(\d{5})(\d)/, "$1-$2")
	},
}