//middleware
const User = require('../../models/User')

module.exports = {
	async post(req, res, next) {
		const keys = Object.keys(req.body)
		for (key of keys) {
			if (req.body[key] == "")
				return res.render('user/register', {
					user: req.body,
					error: 'Por favor, preencha todos os campos.'
				})
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
}