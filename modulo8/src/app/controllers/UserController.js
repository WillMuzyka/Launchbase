const { hash } = require('bcryptjs')
const { unlinkSync } = require('fs')

const User = require('../../models/User')
const Product = require('../../models/Product')
const LoadProductsService = require('../services/LoadProductService')

const { formatCpfCnpj, formatCep } = require("../../lib/utils")

module.exports = {
	registerForm(req, res) {
		return res.render("user/register")
	},
	async post(req, res) {
		try {
			let { name, email, password, cpf_cnpj, cep, address } = req.body
			password = await hash(password, 8)
			cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
			cep = cep.replace(/\D/g, "")

			const userId = await User.create({
				name,
				email,
				password,
				cpf_cnpj,
				cep,
				address
			})

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
			let { name, email, cpf_cnpj, cep, address, id } = req.body
			cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
			cep = cep.replace(/\D/g, "")

			console.log(id, {
				name,
				email,
				cpf_cnpj,
				cep,
				address
			})
			await User.update(id, {
				name,
				email,
				cpf_cnpj,
				cep,
				address
			})

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
			//find all the products from this user
			const products = await Product.findAll({ where: { user_id: req.body.id } })
			//find all the files from the products
			const allFilesPromises = products.map(product =>
				Product.files(product.id))
			const filesResults = await Promise.all(allFilesPromises)
			//delete the user (in cascade, will delete the products and files from db)
			await User.delete(req.body.id)
			//delete all the files related to the product that are saved on the folder "images"
			//this is only made after removing the user
			const allFilesPromise = filesResults
				.map(files =>
					files.map(file => {
						try {
							if (file.path != 'public/images/placeholder.png')
								unlinkSync(file.path)
						}
						catch (error) {
							console.error(error)
						}
					})
				)
			await Promise.all(allFilesPromise)
			//destroy the session
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
	},
	async ads(req, res) {
		const products = await LoadProductsService.load('products', {
			where: { user_id: req.session.userId }
		})
		return res.render("user/ads", { products })
	}
}