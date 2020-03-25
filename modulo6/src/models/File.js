const db = require("../../src/config/db")
const fs = require("fs")

module.exports = {
	create(values) {
		const query = `
		INSERT INTO files (
			name,
			path,
			product_id
		) VALUES ($1, $2, $3)
		RETURNING id`

		return db.query(query, values)
	},
	async delete(id) {
		try {
			const result = await db.query("SELECT * FROM files WHERE id = $1", [id])
			const file = result.rows[0]

			fs.unlinkSync(file.path)

			const query = `
			DELETE
			FROM files
			WHERE id = $1`
			return db.query(query, [id])
		}

		catch (err) {
			console.error(err)
		}
	}
}