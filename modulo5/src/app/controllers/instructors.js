const { calcAge, date } = require('../../lib/utils')
const Instructor = require('../../models/Instructor')

const errorDB = "Database error!"
const errorINF = "Instructor not found!"

module.exports = {
	index(req, res) {
		let { filter, page, limit } = req.query
		page = page || 1
		limit = limit || 4

		const params = {
			filter,
			limit,
			offset: limit * (page - 1),
		}

		Instructor.paginate(params, instructors => {
			instructors = instructors.map(instructor => {
				instructor.services = instructor.services.split(",")
				return instructor
			})

			let totalPages = 0
			if (instructors[0]) totalPages = Math.ceil(instructors[0].total / limit)

			const pages = {
				total: totalPages,
				page
			}
			return res.render("instructors/index", { instructors, filter, pages })
		})
	},
	create(req, res) {
		res.render("instructors/create")
	},
	post(req, res) {
		//name, avatar_url, gender, services, birth, created_at
		const values = [
			req.body.avatar_url,
			req.body.name,
			date(req.body.birth).iso,
			req.body.gender,
			req.body.services,
			date(Date.now()).iso
		]
		Instructor.create(values, instructor => res.redirect(`/instructors/${instructor.id}`))
	},
	show(req, res) {
		Instructor.find(req.params.id, instructor => {
			//if the db doesn't find a instructor with the id
			if (!instructor) return res.render("err", { errorText: errorINF })

			//split the services, calculate the age and format the create_at date
			instructor.services = instructor.services.split(",")
			instructor.age = calcAge(instructor.birth)
			instructor.created_at = date(instructor.created_at).format

			return res.render("instructors/show", { instructor })
		})
	},
	edit(req, res) {
		Instructor.find(req.params.id, instructor => {
			//if the db doesn't find a instructor with the id
			if (!instructor) return res.render("err", { errorText: errorINF })

			//set the date
			instructor.birth = date(instructor.birth).iso
			return res.render("instructors/edit", { instructor })
		})
	},
	put(req, res) {
		const values = [
			req.body.avatar_url,
			req.body.name,
			date(req.body.birth).iso,
			req.body.gender,
			req.body.services,
			req.body.id
		]
		Instructor.update(values, (err) => res.redirect(`/instructors/${req.body.id}`))
	},
	delete(req, res) {
		Instructor.delete(req.body.id, () => res.redirect("/instructors"))
	},
}