const db = require('../config/db')

const errorCheck = err => { if (err) throw `Database Error! ${err}` }

module.exports = {
	all(callback) {
		const query = `
			SELECT *
			FROM students
			ORDER BY name`
		db.query(query, (err, results) => {
			errorCheck(err)
			callback(results.rows)
		})
	},
	create(values, callback) {
		const query = `
		INSERT INTO students (
			name,
			avatar_url,
			birth,
			email,
			school_year,
			credits,
			created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING	id`

		db.query(query, values, (err, results) => {
			errorCheck(err)
			callback()
		})
	},
	find(id, callback) {
		const query = `
		SELECT *
		FROM students
		WHERE id = $1`
		db.query(query, [id], (err, results) => {
			errorCheck(err)
			callback(results.rows[0])
		})
	},
	update(values, callback) {
		const query = `
		UPDATE students
		SET
			name = ($1),
			avatar_url = ($2),
			birth = ($3),
			email = ($4),
			school_year = ($5),
			credits = ($6)
		WHERE id = $7`

		db.query(query, values, (err, results) => {
			errorCheck(err)
			callback()
		})
	},
	delete(id, callback) {
		const query = `
		DELETE
		FROM students
		WHERE id = $1`

		db.query(query, [id], (err, results) => {
			errorCheck(err)
			callback()
		})
	}
}