const db = require('../config/db')

const errorCheck = (err) => {
	if (err) throw `Database error! ${err}`
}

module.exports = {
	all(callback) {
		db.query(`
		SELECT *
		FROM members
		ORDER BY name`, (err, results) => {
			errorCheck(err)
			return callback(results.rows)
		})
	},
	create(values, callback) {
		const query = `INSERT INTO members (
			avatar_url,
			name,
			email,
			birth,
			gender,
			blood,
			weight,
			height,
			instructor_id,
			created_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id`

		db.query(query, values, (err, results) => {
			errorCheck(err)
			return callback(results.rows[0])
		})
	},
	find(id, callback) {
		const query = `
			SELECT members.*, instructors.name instructor_name, instructors.id FROM members
			LEFT JOIN instructors ON (members.instructor_id = instructors.id)
			WHERE members.id=$1`

		db.query(query, [id], (err, results) => {
			errorCheck(err)
			console.log(results.rows[0])
			return callback(results.rows[0])
		})
	},
	update(values, callback) {
		const query = `
			UPDATE members
			SET
				avatar_url = ($1),
				name = ($2),
				email = ($3),
				birth = ($4),
				gender = ($5),
				blood = ($6),
				weight = ($7),
				height = ($8),
				instructor_id = ($9)
			WHERE id = $10`

		db.query(query, values, (err, results) => {
			errorCheck(err)
			return callback()
		})
	},
	delete(id, callback) {
		const query = `
			DELETE
			FROM members
			WHERE id = $1`

		db.query(query, [id], (err, results) => {
			errorCheck(err)
			return callback()
		})
	},
	instructorOptions(callback) {
		const query = `SELECT name, id FROM instructors`
		db.query(query, (err, results) => {
			errorCheck(err)
			callback(results.rows)
		})
	}
}