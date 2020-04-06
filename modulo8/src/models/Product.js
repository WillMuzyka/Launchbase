const Base = require('./Base')
const db = require("../../src/config/db")

Base.init({ table: 'products' })

module.exports = {
	...Base,
	async search({ filter, category }) {
		try {
			let query = `
				SELECT products.*, categories.name as category_name
				FROM products
				LEFT JOIN categories ON (categories.id = products.category_id)
				WHERE 1 = 1`

			if (category) {
				query += ` AND products.category_id = ${category}`
			}
			if (filter) {
				query += ` AND (products.name ilike '%${filter}%'
				OR products.description ilike '%${filter}%')`
			}
			query += ` AND status != 0`
			const results = await db.query(query)
			return results.rows
		}
		catch (error) {
			console.error(error);

		}
	},
	async files(id) {
		try {
			const results = await db.query(`SELECT * FROM files WHERE product_id = $1`, [id])
			return results.rows
		}
		catch (error) {
			console.error(error)
		}
	},
	// getByUser(user_id) {
	// 	return db.query(`SELECT * FROM products	WHERE user_id = $1`, [user_id])
	// }
}