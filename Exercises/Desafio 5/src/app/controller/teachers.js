const { calcAge, showLevel, classType, showDate } = require('../../lib/utils')
const Teacher = require('../../models/Teacher')

module.exports = {
	create: (req, res) => res.render("teachers/create"),
	index: (req, res) => {
		let { filter, page, limit } = req.query

		page = page || 1
		limit = limit || 4
		offset = limit * (page - 1)

		const params = {
			filter,
			offset,
			limit
		}

		Teacher.paginate(params, teachers => {
			teachers = teachers.map(teacher => {
				teacher.subjects_taught = teacher.subjects_taught.split(",")
				return teacher
			})
			let total = 0
			if (teachers[0]) total = Math.ceil(teachers[0].total / limit)
			pages = {
				page,
				total
			}
			return res.render("teachers/index", { teachers, filter, pages })
		})
	},
	post: (req, res) => {
		const values = [
			req.body.name,
			req.body.avatar_url,
			showDate(req.body.birth).iso,
			req.body.education_level,
			req.body.class_type,
			req.body.subjects_taught,
			showDate(Date.now()).iso,
		]

		Teacher.create(values, () => {
			console.log(`Adding ${req.body.name}`)
			return res.redirect("/teachers")
		})
	},
	show: (req, res) => {
		Teacher.find(req.params.id, teacher => {
			if (!teacher) {
				return res.send("Teacher not found")
			}

			teacher.education_level = showLevel(teacher.education_level)
			teacher.class_type = classType(teacher.class_type)
			teacher.age = calcAge(teacher.birth)
			teacher.created_at = showDate(teacher.created_at).format
			teacher.subjects_taught = teacher.subjects_taught.split(",")

			console.log(`Showing ${teacher.name}`)
			return res.render("teachers/show", { teacher })
		})
	},
	edit: (req, res) => {
		Teacher.find(req.params.id, teacher => {
			if (!teacher) return res.send("Teacher not found")

			teacher.birth = showDate(teacher.birth).iso

			console.log(`Editing ${teacher.name}`)
			return res.render("teachers/edit", { teacher })
		})
	},
	update: (req, res) => {
		const values = [
			req.body.name,
			req.body.avatar_url,
			showDate(req.body.birth).iso,
			req.body.education_level,
			req.body.class_type,
			req.body.subjects_taught,
			req.body.id
		]

		Teacher.update(values, () => {
			console.log(`Updating ${req.body.name}`)
			return res.redirect(`/teachers/${req.body.id}`)
		})
	},
	delete: (req, res) => {
		Teacher.delete(req.body.id, () => res.redirect("/teachers"))
	},
}