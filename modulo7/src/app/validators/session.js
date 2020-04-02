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
	async login(req, res, next) {
		try {
			const { email, password } = req.body
			const results = await User.findOne({ where: { email } })
			const user = results.rows[0]

			if (!user) return res.render("session/login", {
				error: "Usuário não cadastrado!",
				user: req.body
			})

			const passed = await compare(password, user.password)
			if (!passed) {
				return res.render("session/login", {
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
	},
	async forgot(req, res, next) {
		try {
			const { email } = req.body
			let results = await User.findOne({ where: { email } })
			user = results.rows[0]

			if (!user) return res.render("session/forgot-password", {
				error: "Usuário não cadastrado!",
				user: req.body
			})

			req.user = user
			next()
		}
		catch (err) {
			console.error(err)
		}
	},
	async reset(req, res, next) {
		try {
			const { email, password, passwordRepeat, token } = req.body
			let results = await User.findOne({ where: { email } })
			user = results.rows[0]

			if (!user) {
				return res.render("session/password-reset", {
					error: "Usuário não cadastrado!",
					user: req.body,
					token
				})
			}

			if (password != passwordRepeat) {
				return res.render('session/password-reset', {
					error: 'As senhas digitadas não conferem.',
					user: req.body,
					token
				})
			}

			if (token != user.reset_token) {
				return res.render('session/password-reset', {
					error: 'Token inválido. Solicite uma nova recuperação de senha.',
					user: req.body,
					token
				})
			}

			let now = new Date()
			now = now.setHours(now.getHours())
			if (now > user.reset_token_expires) {
				return res.render('session/password-reset', {
					error: 'Token expirado. Solicite uma nova recuperação de senha.',
					user: req.body,
					token
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