const { hash } = require('bcryptjs')

const User = require('../../models/User')
const { formatPrice } = require("../../lib/utils")

module.exports = {
	registerForm(req, res) {
		return res.render("user/register")
	},
	async post(req, res) {
		try {
			const passwordHash = await hash(req.body.password, 8)

			const values = [
				req.body.name,
				req.body.email,
				passwordHash,
				req.body.cpf_cnpj.replace(/\D/g, ""),
				req.body.cep.replace(/\D/g, ""),
				req.body.address
			]
			let results = await User.create(values)
			const id = results.rows[0].id

			return res.redirect('/users')
		}
		catch (err) {
			console.error(err)
		}
	},
	async show(req, res) {
		try {
			return res.send("cadastrado")
		}
		catch (err) {
			console.error(err)
		}
	}
}