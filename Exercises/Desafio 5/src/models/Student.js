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
			created_at,
			teacher_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING	id`

		db.query(query, values, (err, results) => {
			errorCheck(err)
			callback()
		})
	},
	find(id, callback) {
		const query = `
		SELECT students.*, teachers.name teacher_name, teachers.id teacher_id
		FROM students
		LEFT JOIN teachers ON (students.teacher_id = teachers.id)
		WHERE students.id = $1`
		db.query(query, [id], (err, results) => {
			errorCheck(err)
			callback(results.rows[0])
		})
	},
	findBy(filter, callback) {
		const query = `
			SELECT students.*
			FROM students
			WHERE students.name ILIKE '%${filter}%'
			OR students.school_year ILIKE '%${filter}%'
			ORDER BY name`
		db.query(query, (err, results) => {
			if (err) throw `Database Error! ${err}`
			callback(results.rows)
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
			credits = ($6),
			teacher_id = ($7)
		WHERE id = $8`

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
	},
	teacherOptions(callback) {
		const query = `SELECT name, id FROM teachers ORDER BY name`
		db.query(query, (err, results) => {
			errorCheck(err)
			callback(results.rows)
		})
	},
	paginate(params, callback) {
		const { filter, offset, limit } = params
		let filterQuery = ""
		if (filter) {
			filterQuery = `
			WHERE students.name ILIKE '%${filter}%'
			OR students.school_year ILIKE '%${filter}%'`
		}
		const totalQuery = `
		(SELECT count(*)
		FROM students
		${filterQuery}) total`

		const query = `
		SELECT students.*, ${totalQuery}
		FROM students
		${filterQuery}
		ORDER BY name LIMIT ${limit} OFFSET ${offset}`

		db.query(query, (err, results) => {
			if (err) throw `Database Error! ${err}`
			callback(results.rows)
		})
	},
}