const { hash } = require('bcryptjs')

const User = require('../../models/User')
const Product = require('../../models/Product')
const File = require('../../models/File')
const { formatCpfCnpj, formatCep } = require("../../lib/utils")

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
			const userId = results.rows[0].id

			req.session.userId = userId

			return res.redirect('/users')
		}
		catch (err) {
			console.error(err)
			return res.render("user/register", {
				error: "Ocorreu algum erro. Por favor, tente novamente."
			})
		}
	},
	show(req, res) {
		const { user } = req

		user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
		user.cep = formatCep(user.cep)

		return res.render('user/index', { user })
	},
	async update(req, res) {
		try {
			const { user } = req
			let { name, email, cpf_cnpj, cep, address, id } = user
			cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
			cep = cep.replace(/\D/g, "")

			const values = {
				name,
				email,
				cpf_cnpj,
				cep,
				address
			}

			await User.update(id, values)

			return res.render("user/index", {
				success: "Conta atualizada com sucesso",
				user: req.body
			})
		}
		catch (err) {
			console.error(err)
			return res.render("user/index", {
				error: "Ocorreu algum erro. Por favor, tente novamente.",
				user: req.user
			})
		}
	},
	async delete(req, res) {
		try {
			let results = await Product.getByUser(req.body.id)
			const products = results.rows

			const allFilesPromises = products.map(product => Product.files(product.id))
			const resultsArray = await Promise.all(allFilesPromises)

			const allFilesPromise = resultsArray
				.map(files => { files.rows.map(file => File.delete(file.id)) })

			await User.delete(req.body.id)
			await Promise.all(allFilesPromise)
			req.session.destroy()

			return res.render("session/login", {
				success: "Conta deletada com sucesso."
			})
		}
		catch (err) {
			console.error(err)
			return res.render("user/index", {
				error: "Erro ao tentar deletar sua conta."
			})
		}
	}
}