const { calcAge, showGrade, showDate } = require('../../lib/utils')
const Student = require('../../models/Student')

module.exports = {
	create: (req, res) => res.render("students/create"),
	index: (req, res) => {
		Student.all(students => {
			students = students.map(student => {
				student.school_year = showGrade(student.school_year)
				return student
			})
			res.render("students/index", { students })
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
			return res.render("students/edit", { student })
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