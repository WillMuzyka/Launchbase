const db = require("../../src/config/db")

module.exports = {
	all() {
		return db.query(`
		SELECT *
		FROM categories
		`)
	}
}