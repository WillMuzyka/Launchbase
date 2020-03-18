const { calcAge, showGrade, showDate } = require('../../lib/utils')
const Student = require('../../models/Student')

module.exports = {
	create: (req, res) => {
		Student.teacherOptions(teacherOptions => res.render("students/create", { teacherOptions }))
	},
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

		Student.paginate(params, students => {
			students = students.map(student => {
				student.school_year = showGrade(student.school_year)
				return student
			})

			let total = 0
			if (students[0]) total = Math.ceil(students[0].total / limit)
			pages = {
				page,
				total
			}
			return res.render("students/index", { students, filter, pages })
		})
	},
	post: (req, res) => {
		const values = [
			req.body.name,
			req.body.avatar_url,
			showDate(req.body.birth).iso,
			req.body.email,
			req.body.school_year,
			req.body.credits,
			showDate(Date.now()).iso,
			req.body.teacher_id
		]

		Student.create(values, () => {
			console.log(`Adding ${req.body.name}`)
			return res.redirect("/students")
		})
	},
	show: (req, res) => {
		Student.find(req.params.id, student => {
			if (!student) {
				return res.send("Student not found")
			}

			student.age = calcAge(student.birth)
			student.created_at = showDate(student.created_at).format
			student.school_year = showGrade(student.school_year)

			console.log(`Showing ${student.name}`)
			return res.render("students/show", { student })
		})
	},
	edit: (req, res) => {
		Student.find(req.params.id, student => {
			if (!student) return res.send("Student not found")

			student.birth = showDate(student.birth).iso

			console.log(`Editing ${student.name}`)
			Student.teacherOptions(teacherOptions => res.render("students/edit", { student, teacherOptions }))
		})
	},
	update: (req, res) => {
		const values = [
			req.body.name,
			req.body.avatar_url,
			showDate(req.body.birth).iso,
			req.body.email,
			req.body.school_year,
			req.body.credits,
			req.body.teacher_id,
			req.body.id
		]

		Student.update(values, () => {
			console.log(`Updating ${req.body.name}`)
			return res.redirect(`/students/${req.body.id}`)
		})
	},
	delete: (req, res) => {
		Student.delete(req.body.id, () => res.redirect("/students"))
	},
}