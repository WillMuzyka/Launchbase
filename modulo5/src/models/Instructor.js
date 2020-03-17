const db = require('../config/db')

const errorCheck = (err) => {
	if (err) throw `Database error! ${err}`
}

module.exports = {
	all(callback) {
		db.query(`
		SELECT instructors.*, count(members) students
		FROM instructors
		LEFT JOIN members ON (instructors.id = members.instructor_id)
		GROUP BY instructors.id
		ORDER BY students DESC`, (err, results) => {
			errorCheck(err)
			return callback(results.rows)
		})
	},
	create(values, callback) {
		const query = `INSERT INTO instructors (
			avatar_url,
			name,
			birth,
			gender,
			services,
			created_at
		) VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id`

		db.query(query, values, (err, results) => {
			errorCheck(err)
			return callback(results.rows[0])
		})
	},
	find(id, callback) {
		const query = `
			SELECT *
			FROM instructors
			WHERE id=$1`

		db.query(query, [id], (err, results) => {
			errorCheck(err)
			return callback(results.rows[0])
		})
	},
	findBy(filter, callback) {
		db.query(`
		SELECT instructors.*, count(members) students
		FROM instructors
		LEFT JOIN members ON (instructors.id = members.instructor_id)
		WHERE instructors.name ILIKE '%${filter}%'
		OR instructors.services ILIKE '%${filter}%'
		GROUP BY instructors.id
		ORDER BY students DESC`, (err, results) => {
			errorCheck(err)
			return callback(results.rows)
		})
	},
	update(values, callback) {
		const query = `
			UPDATE instructors
			SET
				avatar_url = ($1),
				name = ($2),
				birth = ($3),
				gender = ($4),
				services = ($5)
			WHERE id = $6`

		db.query(query, values, (err, results) => {
			errorCheck(err)
			return callback()
		})
	},
	delete(id, callback) {
		const query = `
			DELETE
			FROM instructors
			WHERE id = $1`

		db.query(query, [id], (err, results) => {
			errorCheck(err)
			return callback()
		})
	}
}