const fs = require('fs')
const data = require('./data.json')
const { calcAge, showLevel, classType, showDate } = require('./utils')

exports.create = (req, res) => res.render("teachers/create")

exports.post = (req, res) => {
	let { name, avatar_url, birth, level, class_style, services } = (req.body)
	const teacher = {
		id: Number(data.teachers.length + 1),
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
}

exports.show = (req, res) => {
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
		created_at: showDate(foundTeacher.created_at, true),
		services: foundTeacher.services.split(",")
	}
	console.log(`Showing ${teacher.name}`)
	return res.render("teachers/show", { teacher })
}

exports.edit = (req, res) => {
	const { id } = req.params
	const foundTeacher = data.teachers.find((person, index) => person.id == id)
	if (!foundTeacher) return res.send("Teacher not found")

	const teacher = {
		...foundTeacher,
		level: showLevel(foundTeacher.level),
		class_style: classType(foundTeacher.class_style),
		birth: showDate(foundTeacher.birth, false),
		services: foundTeacher.services.split(","),
		levelID: foundTeacher.level,
		class_styleID: foundTeacher.class_style
	}
	console.log(`Editing ${teacher.name}`)
	return res.render("teachers/edit", { teacher })
}

exports.put = (req, res) => {
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
		birth: Date.parse(req.body.birth),
	}

	data.teachers[foundIndex] = teacher

	console.log(`Updating ${teacher.name}`)
	fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
		err ? res.send("Erro ao Salvar") : res.redirect(`/teachers/${id}`)
	})
}