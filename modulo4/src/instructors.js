const fs = require('fs')
const data = require('./data.json')
const { calcAge, date } = require('./functions.js')

const findInstructor = (id) => {
	return data.instructors.find(instructor => instructor.id == id)
}

exports.post = (req, res) => {
	const keys = Object.keys(req.body)
	for (key of keys) {
		req.body[key] == "" ? res.send("Por favor, preencha todos os campos") : null
	}

	let { name, birth, gender, avatar_url, services } = req.body

	birth = Date.parse(birth)
	const created_at = Date.now()
	const id = Number(data.instructors.length + 1);

	data.instructors.push({
		id,
		avatar_url,
		name,
		birth,
		gender,
		services,
		created_at
	})

	fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
		err ? res.send(err) : res.redirect("/instructors")
	})
}

exports.show = (req, res) => {
	const { id } = req.params
	const foundInstructor = findInstructor(id)
	if (!foundInstructor) return res.send("Instructor not found")

	const instructor = {
		...foundInstructor,
		age: calcAge(foundInstructor.birth),
		services: foundInstructor.services.split(","),
		created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
	}

	return res.render("instructors/show", { instructor })
}

exports.edit = (req, res) => {
	const { id } = req.params
	const foundInstructor = findInstructor(id)
	if (!foundInstructor) return res.send("Instructor not found")
	
	const instructor = {
		...foundInstructor,
		birth: date(foundInstructor.birth)
	}

	return res.render("instructors/edit", { instructor })
}

exports.put = (req, res) => {
	const { id } = req.body
	let index
	const foundInstructor = data.instructors.find((instructor, foundIndex) => {
		if (instructor.id == id) {
			index = foundIndex
			return true
		}
	})
	if (!foundInstructor) return res.send("Instructor not found")
	
	const instructor = {
		...foundInstructor,
		...req.body,
		birth: Date.parse(req.body.birth)
	}

	data.instructors[index] = instructor

	fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
		err ? res.send("write error!") : res.redirect(`/instructors/${ id }`)
	})
}

exports.delete = (req, res) => {
	return res.send("Delete")
}