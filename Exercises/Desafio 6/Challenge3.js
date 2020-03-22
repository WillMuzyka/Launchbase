const Mask = {
	apply(input, func) {
		setTimeout(() => input.value = Mask[func](input.value), 1)
	},
	cpf(value) {
		value = value.replace(/\D/g, "")

		const chainPairs = [
			//xxx.xxx.xx-xx
			//   |   |  |
			//   3º  7º 11º
			[3, "."],
			[7, "."],
			[11, "-"]
		]
		for (pair of chainPairs) {
			if (value[pair[0]]) value = value.slice(0, pair[0]) + pair[1] + value.slice(pair[0], 13)
		}
		return value
	},
	percentage(value) {
		value = new Intl.NumberFormat('en-IN',
			{
				minimumFractionDigits: 2,
				maximumFractionDigits: 4,
				style: "percent"
			}).format(value.replace(/\D/g, "") / 10000)
		return value
	}
}