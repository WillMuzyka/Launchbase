const fs = require('fs')
const data = require('./data.json')

exports.create = (req, res) => {
	return res.render("teachers/create")
}

exports.post = (req, res) => {
	let { name, avatar_url, birth, level, class_style, services } = (req.body)
	const instructor = {
		id: Number(data.instructors.length + 1),
		avatar_url,
		name,
		birth: Date.parse(birth),
		level,
		class_style,
		services: services.split(",")
			.map(str => str.trim()),
		created_at: Date.now(),
	}

	fs.writeFile("src/data.json", JSON.stringify(instructor, null, 2), (err) => {
		err ? res.send("Erro ao Salvar") : res.redirect("/")
	})
}
