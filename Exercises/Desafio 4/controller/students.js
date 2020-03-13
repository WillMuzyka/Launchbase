const fs = require('fs')
const data = require('../src/data.json')
const { calcAge, showDate, showGrade } = require('../src/utils')

module.exports = {
	create: (req, res) => res.render("students/create"),
	index: (req, res) => {
		let students = data.students
		students = students.map(student => {
			student = {
				...student,
				year: showGrade(student.year).replace(" ano", ""),
			}
			return student
		})
		res.render("students/index", { students })

	},
	post: (req, res) => {
		let { name, avatar_url, birth, email, year, credits } = (req.body)

		let newId = 1
		const lastStudent = data.students[data.students.length - 1]
		if (lastStudent) newId = Number(lastStudent.id) + 1

		credits = Number(credits)

		const student = {
			id: newId,
			avatar_url,
			name,
			birth: Date.parse(birth),
			email,
			year,
			credits,
			created_at: Date.now(),
		}

		data.students.push(student)

		console.log(`Adding ${student.name}`)
		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			err ? res.send("Erro ao Salvar") : res.redirect("/students")
		})
	},
	show: (req, res) => {
		const { id } = req.params
		const foundStudent = data.students.find(person => person.id == id)
		if (!foundStudent) {
			return res.send("Student not found")
		}
		const student = {
			...foundStudent,
			year: showGrade(foundStudent.year),
			age: calcAge(foundStudent.birth),
			created_at: new Intl.DateTimeFormat("en-GB").format(foundStudent.created_at)
		}
		console.log(`Showing ${student.name}`)
		return res.render("students/show", { student })
	},
	edit: (req, res) => {
		const { id } = req.params
		const foundStudent = data.students.find((person, index) => person.id == id)
		if (!foundStudent) return res.send("Student not found")

		const student = {
			...foundStudent,
			birth: showDate(foundStudent.birth),
		}
		console.log(`Editing ${student.name}`)
		return res.render("students/edit", { student })
	},
	update: (req, res) => {
		const { id } = req.body
		let foundIndex
		const foundStudent = data.students.find((person, index) => {
			if (person.id == id) {
				foundIndex = index
				return true
			}
		})
		if (!foundStudent) return res.send("Student not found")

		const student = {
			...foundStudent,
			...req.body,
			id: foundStudent.id,
			birth: Date.parse(req.body.birth),
		}

		data.students[foundIndex] = student

		console.log(`Updating ${student.name}`)
		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			err ? res.send("Error trying to save") : res.redirect(`/students/${id}`)
		})
	},
	delete: (req, res) => {
		const { id } = req.body
		const studentsList = data.students.filter(person => person.id != id)

		data.students = studentsList
		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			err ? res.send("Error trying to save") : res.redirect("/students")
		})
	},
}