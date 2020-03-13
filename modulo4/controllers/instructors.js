const fs = require('fs')
const data = require('../src/data.json')
const { calcAge, date } = require('../src/utils.js')

const findInstructor = (id) => {
	return data.instructors.find(instructor => instructor.id == id)
}
module.exports = {
	index: (req, res) => {
		let instructors = data.instructors.map(instructor => {
			const services = instructor.services.split(",")

			const newInstructor = {
				...instructor,
				services: services
			}
			return newInstructor
		})
		return res.render("instructors/index", { instructors })
	},
	post: (req, res) => {
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
			err ? res.send(err) : res.redirect(`/instructors/${id}`)
		})
	},
	show: (req, res) => {
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
	},
	edit: (req, res) => {
		const { id } = req.params
		const foundInstructor = findInstructor(id)
		if (!foundInstructor) return res.send("Instructor not found")

		const instructor = {
			...foundInstructor,
			birth: date(foundInstructor.birth)
		}

		return res.render("instructors/edit", { instructor })
	},
	put: (req, res) => {
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
			id: Number(req.body.id),
			birth: Date.parse(req.body.birth)
		}

		data.instructors[index] = instructor

		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			err ? res.send("write error!") : res.redirect(`/instructors/${id}`)
		})
	},
	delete: (req, res) => {
		const { id } = req.body
		const instructorsList = data.instructors.filter(inst => inst.id != id)
		instructorsList.map(inst => {
			if (inst.id > id) {
				return {
					...inst,
					id: Number(inst.id--)
				}
			}
			return inst
		})
		data.instructors = instructorsList
		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			err ? res.send(err) : res.redirect("/instructors")
		})
	},
}