const db = require("../../src/config/db")

module.exports = {
	all() {
		return db.query(`SELECT * FROM products ORDER BY updated DESC`)
	},
	create(values) {
		const query = `
		INSERT INTO products (
			category_id,
			user_id,
			name,
			description,
			old_price,
			price,
			quantity,
			status
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id`

		return db.query(query, values)
	},
	find(id) {
		return db.query(`SELECT * FROM products	WHERE id = $1`, [id])
	},
	update(values) {
		const query = `
		UPDATE products
		SET
			category_id = ($1),
			user_id = ($2),
			name = ($3),
			description = ($4),
			old_price = ($5),
			price = ($6),
			quantity = ($7),
			status = ($8)
		WHERE id = $9`

		db.query(query, values)
	},
	delete(id) {
		return db.query(`DELETE FROM products WHERE id = $1`, [id])
	},
	files(id) {
		return db.query(`SELECT * FROM files WHERE product_id = $1`, [id])
	},
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
	}
}