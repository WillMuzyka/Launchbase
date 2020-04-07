const db = require("../../src/config/db")

function find(table, filters) {
	let query = `SELECT * FROM ${table}`
	if (filters) {
		Object.keys(filters).map(key => {
			query += ` ${key}`
			Object.keys(filters[key]).map(field => {
				query += ` ${field} = '${filters[key][field]}'`
			})
		})
	}
	return db.query(query)
}

module.exports = {
	init({ table }) {
		if (!table) throw new Error('Invalid params!')
		this.table = table
	},
	async find(id) {
		try {
			const results = await find(this.table, { where: { id } })
			return results.rows[0]
		}
		catch (error) {
			console.error(error)
		}
	},
	async findOne(filters) {
		try {
			const results = await find(this.table, filters)
			return results.rows[0]
		}
		catch (error) {
			console.error(error)
		}
	},
	async findAll(filters) {
		try {
			const results = await find(this.table, filters)
			return results.rows
		} catch (error) {
			console.error(error)
		}
	},
	async create(fields) {
		try {
			let tags = [], values = []
			Object.keys(fields).map(key => {
				tags.push(key)
				values.push(`'${fields[key]}'`)
			})

			const query = `INSERT INTO ${this.table} (${tags.join(",")})
		VALUES (${values.join(",")})
		RETURNING id;`

			const results = await db.query(query)
			return results.rows[0].id
		}
		catch (error) {
			console.error(error);

		}
	},
	update(id, fields) {
		let values = []
		Object.keys(fields).map((key, index, array) => {
			if (fields[key] == null)
				values.push(`${key} = NULL`)
			else
				values.push(`${key} = '${fields[key]}'`)
		})

		let query = `
		UPDATE ${this.table}
		SET ${values.join(",")}
		WHERE id = ${id}`

		return db.query(query)
	},
	delete(id) {
		return db.query(`DELETE FROM ${this.table} WHERE id = ${id}`)
	},
}