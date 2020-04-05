//middleware
const User = require('../../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
	const keys = Object.keys(body)
	for (key of keys) {
		if (body[key] == "")
			return {
				user: body,
				error: 'Por favor, preencha todos os campos.'
			}
	}
	return null
}

module.exports = {
	async post(req, res, next) {
		try {
			const fillAllFields = checkAllFields(req.body)
			if (fillAllFields) {
				return res.render('user/register', fillAllFields)
			}


			//check if user exits (email, cpf_cnpj)
			const { email, cpf_cnpj, password, passwordRepeat } = req.body
			let results = await User.findOne({
				where: { email },
				or: { cpf_cnpj: cpf_cnpj.replace(/\D/g, "") }
			})
			const user = results.rows[0]

			if (user)
				return res.render('user/register', {
					user: req.body,
					error: 'Usuário já cadastrado'
				})
			//password matches
			if (password != passwordRepeat)
				return res.render('user/register', {
					user: req.body,
					error: 'As senhas digitadas não conferem.'
				})

			next()
		}
		catch (err) {
			console.error(err)
		}
	},
	async show(req, res, next) {
		try {
			const { userId: id } = req.session
			const results = await User.findOne({ where: { id } })
			const user = results.rows[0]

			if (!user) return res.render("user/register", {
				error: "Usuário não encontrado!"
			})

			req.user = user

			next()
		}
		catch (err) {
			console.error(err)
		}
	},
	async update(req, res, next) {
		try {
			const fillAllFields = checkAllFields(req.body)
			if (fillAllFields) {
				return res.render('user/index', fillAllFields)
			}

			const { id, password } = req.body

			if (!password) {
				return res.render("user/index", {
					user: req.body,
					error: 'Digite sua senha para atualizar seu cadastro.'
				})
			}

			let results = await User.findOne({ where: { id } })
			const user = results.rows[0]

			const passed = await compare(password, user.password)
			if (!passed) {
				return res.render("user/index", {
					user: req.body,
					error: 'Senha incorreta.'
				})
			}

			req.user = user

			next()
		}
		catch (err) {
			console.error(err)
		}
	}
}