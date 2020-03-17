const db = require('../config/db')

module.exports = {
	all(callback) {
		const query = `
			SELECT teachers.*, count(students) students
			FROM teachers
			LEFT JOIN students ON (teachers.id = students.teacher_id)
			GROUP BY teachers.id
			ORDER BY name`
		db.query(query, (err, results) => {
			if (err) throw `Database Error! ${err}`
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
			if (err) throw `Database Error! ${err}`
			callback()
		})
	},
	find(id, callback) {
		const query = `
		SELECT *
		FROM teachers
		WHERE id = $1`
		db.query(query, [id], (err, results) => {
			if (err) throw `Database Error! ${err}`
			callback(results.rows[0])
		})
	},
	findBy(filter, callback) {
		const query = `
			SELECT teachers.*, count(students) students
			FROM teachers
			LEFT JOIN students ON (teachers.id = students.teacher_id)
			WHERE teachers.name ILIKE '%${filter}%'
			OR teachers.subjects_taught ILIKE '%${filter}%'
			GROUP BY teachers.id
			ORDER BY name`
		db.query(query, (err, results) => {
			if (err) throw `Database Error! ${err}`
			callback(results.rows)
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
			if (err) throw `Database Error! ${err}`
			callback()
		})
	},
	delete(id, callback) {
		const query = `
		DELETE
		FROM teachers
		WHERE id = $1`

		db.query(query, [id], (err, results) => {
			if (err) throw `Database Error! ${err}`
			callback()
		})
	}
}