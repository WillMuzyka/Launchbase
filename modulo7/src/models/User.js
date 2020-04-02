const db = require("../config/db")

const Product = require('../models/Product')

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
	},
	update(id, fields) {
		let query = `UPDATE users SET`
		Object.keys(fields).map((key, index, array) => {
			if (fields[key] == null) {
				query = `${query}
					${key} = NULL`
			} else {
				query = `${query}
					${key} = '${fields[key]}'`
			}


			if (index + 1 < array.length)
				query = `${query},`
			else {
				query = `${query} WHERE id = ${id}`
			}
		})

		return db.query(query)
	},
	delete(id) {
		return db.query(`DELETE FROM users WHERE id = ${id}`)
	},
}