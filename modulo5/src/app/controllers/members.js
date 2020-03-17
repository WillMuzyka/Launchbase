const { calcAge, date } = require('../../lib/utils.js')
const Member = require('../../models/Member')

const errorDB = "Database error!"
const errorINF = "Member not found!"

module.exports = {
	index(req, res) {
		const { filter } = req.query
		if (filter) {
			Member.findBy(filter, members => {
				return res.render("members/index", { members })
			})
		} else {
			Member.all(members => {
				return res.render("members/index", { members })
			})
		}

	},
	create(req, res) {
		Member.instructorOptions(options => res.render("members/create", { instructorOptions: options }))
	},
	post(req, res) {
		//avatar_url, name, email, birth, gender, blood, weight, height, created_at
		const values = [
			req.body.avatar_url,
			req.body.name,
			req.body.email,
			date(req.body.birth).iso,
			req.body.gender,
			req.body.blood,
			req.body.weight,
			req.body.height,
			req.body.instructor,
			date(Date.now()).iso
		]
		Member.create(values, member => res.redirect(`/members/${member.id}`))
	},
	show(req, res) {
		Member.find(req.params.id, member => {
			//if the db doesn't find a member with the id
			if (!member) return res.render("err", { errorText: errorINF })

			//calculate the age and format the create_at date
			member.age = calcAge(member.birth)
			member.created_at = date(member.created_at).format
			return res.render("members/show", { member })
		})
	},
	edit(req, res) {
		Member.find(req.params.id, member => {
			//if the db doesn't find a member with the id
			if (!member) return res.render("err", { errorText: errorINF })

			//set the date
			member.birth = date(member.birth).iso

			Member.instructorOptions(options => res.render("members/edit", { member, instructorOptions: options }))
		})
	},
	update(req, res) {
		//avatar_url, name, email, birth, gender, blood, weight, height, id
		const values = [
			req.body.avatar_url,
			req.body.name,
			req.body.email,
			date(req.body.birth).iso,
			req.body.gender,
			req.body.blood,
			req.body.weight,
			req.body.height,
			req.body.instructor,
			req.body.id
		]
		Member.update(values, (err) => res.redirect(`/members/${req.body.id}`))
	},
	delete(req, res) {
		Member.delete(req.body.id, () => res.redirect("/members"))
	},
}