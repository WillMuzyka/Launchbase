const User = require('../../models/User')

const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
	loginForm(req, res) {
		return res.render("session/login")
	},
	login(req, res) {
		req.session.userId = req.user.id

		return res.redirect("/users")
	},
	logout(req, res) {
		req.session.destroy()
		return res.redirect("/")
	},
	forgotForm(req, res) {
		return res.render("session/forgot-password")
	},
	async forgot(req, res) {
		try {
			const { user } = req
			const token = crypto.randomBytes(20).toString("hex")
			let now = new Date()
			now = now.setHours(now.getHours() + 1)

			await User.update(user.id, {
				reset_token: token,
				reset_token_expires: now
			})

			mailer.sendMail({
				to: user.email,
				from: "no-reply@launchstore.com",
				subject: "Recuperação de Senha LaunchStore",
				html: `<h2>Perdeu a chave de acesso?</h2>
			<p>Não se preocupe, clique no link abaixo para recuperar sua senha!</p>
			<p>
				<a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
					CLIQUE AQUI PARA RECUPERAR SUA SENHA!
				</a>
			</p>
			<p>Caso você não tenha solicitado o reset de senha, por favor desconsidere este email.</p>
			
			`
			})

			return res.render("session/login", {
				success: "Um email foi enviado para reset de senha. Verifique sua caixa de email."
			})
		}
		catch (err) {
			console.error(err)
			return res.render("session/login", {
				error: "Ocorreu algum erro. Por favor, tente novamente."
			})
		}
	},
	resetForm(req, res) {
		return res.render("session/password-reset", { token: req.query.token })
	},
	async reset(req, res) {
		const { password, token } = req.body
		try {
			const newPassword = await hash(password, 8)

			await User.update(user.id, {
				password: newPassword,
				reset_token: null,
				reset_token_expires: null
			})

			return res.render("session/login", {
				user: req.body,
				success: "Senha atualizada com sucesso!"
			})
		}
		catch (err) {
			console.error(err)
			return res.render("session/password-reset", {
				error: "Ocorreu algum erro. Por favor, tente novamente.",
				user: req.body,
				token
			})
		}
	},

}