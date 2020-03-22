const Mask = {
	apply(input, func) {
		setTimeout(() => {
			input.value = Mask[func](input.value)
		}, 1)
	},
	formatBRL(value) {
		return new Intl.NumberFormat('pt-br', {
			style: "currency",
			currency: "BRL"
		}).format(value.replace(/\D/g, '') / 100)
	}
}