const Base = require('./Base')
const db = require("../../src/config/db")

Base.init({ table: 'products' })

module.exports = {
	...Base,
	search(params) {
		const { filter, category } = params
		let query = "", filterQuery = "WHERE"
		if (category) {
			filterQuery = `
			${filterQuery} products.category_id = ${category}
			AND`
		}
		filterQuery = `
		${filterQuery} products.name ilike '%${filter}%'
			OR products.description ilike '%${filter}%'`

		query = `
			SELECT products.*, categories.name as category_name
			FROM products
			LEFT JOIN categories ON (categories.id = products.category_id)
			${filterQuery}`

		return db.query(query)
	},
	async files(id) {
		try {
			const results = await db.query(`SELECT * FROM files WHERE product_id = $1`, [id])
			return results.rows
		} catch (error) {
			console.error(error)
		}
	},
	// getByUser(user_id) {
	// 	return db.query(`SELECT * FROM products	WHERE user_id = $1`, [user_id])
	// }
}