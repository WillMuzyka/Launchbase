const db = require('../config/db')

module.exports = {
	all(callback) {
		db.query(`
		SELECT *
		FROM members
		ORDER BY name`, (err, results) => {
			if (err) throw `Database error! ${err}`
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
			created_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id`

		db.query(query, values, (err, results) => {
			if (err) throw `Database error! ${err}`
			return callback(results.rows[0])
		})
	},
	find(id, callback) {
		const query = `
			SELECT *
			FROM members
			WHERE id=$1`

		db.query(query, [id], (err, results) => {
			if (err) throw `Database error! ${err}`
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
				height = ($8)
			WHERE id = $9`

		db.query(query, values, (err, results) => {
			if (err) throw `Database error! ${err}`
			return callback()
		})
	},
	delete(id, callback) {
		const query = `
			DELETE
			FROM members
			WHERE id = $1`

		db.query(query, [id], (err, results) => {
			if (err) throw `Database error! ${err}`
			return callback()
		})
	}
}