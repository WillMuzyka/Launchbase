const db = require('../config/db')

const errorCheck = err => { if (err) throw `Database Error! ${err}` }

module.exports = {
	all(callback) {
		const query = `
			SELECT *
			FROM teachers
			ORDER BY name`
		db.query(query, (err, results) => {
			errorCheck(err)
			callback(results.rows)
		})
	},
	create(values, callback) {
		const query = `
		INSERT INTO teachers (
			name,
			avatar_url,
			birth,
			education_level,
			class_type,
			subjects_taught,
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
		FROM teachers
		WHERE id = $1`
		db.query(query, [id], (err, results) => {
			errorCheck(err)
			callback(results.rows[0])
		})
	},
	update(values, callback) {
		const query = `
		UPDATE teachers
		SET
			name = ($1),
			avatar_url = ($2),
			birth = ($3),
			education_level = ($4),
			class_type = ($5),
			subjects_taught = ($6)
		WHERE id = $7`

		db.query(query, values, (err, results) => {
			errorCheck(err)
			callback()
		})
	},
	delete(id, callback) {
		const query = `
		DELETE
		FROM teachers
		WHERE id = $1`

		db.query(query, [id], (err, results) => {
			errorCheck(err)
			callback()
		})
	}
}