const db = require("../config/db")

module.exports = {
	findOne(filters) {
		let query = `SELECT * FROM users`
		Object.keys(filters).map(key => {
			query = `${query}
			${key}`
			Object.keys(filters[key]).map(field => {
				query = `${query} ${field} = '${filters[key][field]}'`
			})
		})
		return db.query(query)
	},
	create(values) {
		const query = `
		INSERT INTO users (
			name,
			email,
			password,
			cpf_cnpj,
			cep,
			address
		) VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id`

		return db.query(query, values)
	}
}