const fs = require('fs')
const data = require('../src/data.json')
const { calcAge, showLevel, classType, showDate } = require('../src/utils')

module.exports = {
	create: (req, res) => res.render("teachers/create"),
	index: (req, res) => {
		let teachers = data.teachers
		teachers = teachers.map(teacher => {
			const services = teacher.services.split(",")
			teacher = {
				...teacher,
				services: services,
			}
			return teacher
		})
		res.render("teachers/index", { teachers })

	},
	post: (req, res) => {
		let { name, avatar_url, birth, level, class_style, services } = (req.body)
		let newId = 1
		const lastTeacher = data.teachers[data.teachers.length - 1]
		if (lastTeacher) newId = Number(lastTeacher.id) + 1

		const teacher = {
			id: newId,
			avatar_url,
			name,
			birth: Date.parse(birth),
			level,
			class_style,
			services,
			created_at: Date.now(),
		}

		data.teachers.push(teacher)

		console.log(`Adding ${teacher.name}`)
		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			err ? res.send("Erro ao Salvar") : res.redirect("/teachers")
		})
	},
	show: (req, res) => {
		const { id } = req.params
		const foundTeacher = data.teachers.find(person => person.id == id)
		if (!foundTeacher) {
			return res.send("Teacher not found")
		}
		const teacher = {
			...foundTeacher,
			level: showLevel(foundTeacher.level),
			class_style: classType(foundTeacher.class_style),
			age: calcAge(foundTeacher.birth),
			created_at: new Intl.DateTimeFormat("en-GB").format(foundTeacher.created_at),
			services: foundTeacher.services.split(",")
		}
		console.log(`Showing ${teacher.name}`)
		return res.render("teachers/show", { teacher })
	},
	edit: (req, res) => {
		const { id } = req.params
		const foundTeacher = data.teachers.find((person, index) => person.id == id)
		if (!foundTeacher) return res.send("Teacher not found")

		const teacher = {
			...foundTeacher,
			level: showLevel(foundTeacher.level),
			class_style: classType(foundTeacher.class_style),
			birth: showDate(foundTeacher.birth),
			services: foundTeacher.services.split(","),
			levelID: foundTeacher.level,
			class_styleID: foundTeacher.class_style
		}
		console.log(`Editing ${teacher.name}`)
		return res.render("teachers/edit", { teacher })
	},
	update: (req, res) => {
		const { id } = req.body
		let foundIndex
		const foundTeacher = data.teachers.find((person, index) => {
			if (person.id == id) {
				foundIndex = index
				return true
			}
		})
		if (!foundTeacher) return res.send("Teacher not found")

		const teacher = {
			...foundTeacher,
			...req.body,
			id: foundTeacher.id,
			birth: Date.parse(req.body.birth),
		}

		data.teachers[foundIndex] = teacher

		console.log(`Updating ${teacher.name}`)
		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			err ? res.send("Error trying to save") : res.redirect(`/teachers/${id}`)
		})
	},
	delete: (req, res) => {
		const { id } = req.body
		const teachersList = data.teachers.filter(person => person.id != id)

		data.teachers = teachersList
		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			err ? res.send("Error trying to save") : res.redirect("/teachers")
		})
	},
}