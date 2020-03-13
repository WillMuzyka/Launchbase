const fs = require('fs')
const data = require('../src/data.json')
const { calcAge, date } = require('../src/utils.js')

const findMember = (id) => {
	return data.members.find(member => member.id == id)
}

module.exports = {
	index: (req, res) => {
		let members = data.members.map(member => {
			const newMember = {
				...member
			}
			return newMember
		})
		return res.render("members/index", { members })
	},
	post: (req, res) => {
		const keys = Object.keys(req.body)
		for (key of keys) {
			req.body[key] == "" ? res.send("Por favor, preencha todos os campos") : null
		}

		let { name, email, birth, gender, avatar_url, blood, weight, height } = req.body

		birth = Date.parse(birth)
		const created_at = Date.now()
		const id = Number(data.members.length + 1);

		data.members.push({
			id,
			avatar_url,
			name,
			email,
			birth,
			gender,
			blood,
			weight,
			height,
			created_at
		})

		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			err ? res.send(err) : res.redirect(`/members/${id}`)
		})
	},
	show: (req, res) => {
		const { id } = req.params
		const foundMember = findMember(id)
		if (!foundMember) return res.send("Member not found")
		const member = {
			...foundMember,
			age: calcAge(foundMember.birth),
			created_at: new Intl.DateTimeFormat("pt-BR").format(foundMember.created_at),
		}

		return res.render("members/show", { member })
	},
	edit: (req, res) => {
		const { id } = req.params
		const foundMember = findMember(id)
		if (!foundMember) return res.send("Member not found")

		const member = {
			...foundMember,
			birth: date(foundMember.birth)
		}

		return res.render("members/edit", { member })
	},
	put: (req, res) => {
		const { id } = req.body
		let index
		const foundMember = data.members.find((member, foundIndex) => {
			if (member.id == id) {
				index = foundIndex
				return true
			}
		})
		if (!foundMember) return res.send("Member not found")

		const member = {
			...foundMember,
			...req.body,
			id: Number(req.body.id),
			birth: Date.parse(req.body.birth)
		}

		data.members[index] = member

		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			err ? res.send("write error!") : res.redirect(`/members/${id}`)
		})
	},
	delete: (req, res) => {
		const { id } = req.body
		const membersList = data.members.filter(inst => inst.id != id)
		membersList.map(inst => {
			if (inst.id > id) {
				return {
					...inst,
					id: Number(inst.id--)
				}
			}
			return inst
		})
		data.members = membersList
		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			err ? res.send(err) : res.redirect("/members")
		})
	},
}