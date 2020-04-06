const { unlinkSync } = require('fs')

const Category = require("../../models/Category")
const Product = require("../../models/Product")
const File = require("../../models/File")
const LoadProductService = require("../services/LoadProductService")

module.exports = {
	async create(req, res) {
		try {
			//get all the categories of the products
			const categories = await Category.findAll()

			return res.render("products/create", { categories })
		}
		catch (error) {
			console.error(error)
			return res.render("home/index", {
				error: "Erro ao acessar criação de produto. Por favor, tente novamente.",
			})
		}
	},
	async post(req, res) {
		let categories = []
		try {
			//create the product
			let { category_id, name, description, old_price,
				price, quantity, status } = req.body
			price = price.replace(/\D/g, '')
			const product_id = await Product.create({
				category_id,
				user_id: req.session.userId,
				name,
				description,
				old_price: price,
				price,
				quantity,
				status: 1,
			})
			//create the files
			const filesPromise = req.files.map(file => {
				fileValues = {
					name: file.filename,
					path: file.path,
					product_id,
				}
				return File.create(fileValues)
			})
			await Promise.all(filesPromise)

			return res.redirect(`products/${product_id}`)
		}
		catch (error) {
			console.error(error)
			return res.render("products/create", {
				error: "Erro ao acessar criação de produto. Por favor, tente novamente.",
				categories,
				product: req.body
			})
		}
	},
	async show(req, res) {
		try {
			//find the product
			const product = await LoadProductService.load('product', { where: { id: req.params.id } })

			return res.render("products/show", { product })
		}
		catch (error) {
			console.error(error)
			return res.render("home/index", {
				error: "Erro na apresentação dos produtos.",
			})
		}
	},
	async edit(req, res) {
		try {
			//find the product
			const product = await LoadProductService.load('product', {
				where: { id: req.params.id }
			})
			//get all the categories of the products
			const categories = await Category.findAll()

			return res.render("products/edit", { product, categories })
		}
		catch (error) {
			console.error(error)
			return res.render("home/index", {
				error: "Erro ao acessar edição do produto. Por favor, tente novamente.",
			})
		}
	},
	async put(req, res) {
		try {
			//get the data that is being updated, formatting the necessary
			let { id, category_id, name, description, old_price,
				price, quantity, status, deleted_id } = req.body
			price = req.body.price.replace(/\D/g, '')
			//update old_price if the price is changed
			const oldProduct = await Product.find(id)
			if (price != oldProduct.price) {
				old_price = oldProduct.price
			}
			//update 'files' if there's new photos
			if (req.files.length > 0) {
				const newFilesPromises = req.files.map(file => {
					newFilesValue = {
						name: file.filename,
						path: file.path,
						product_id: id,
					}
					return File.create(newFilesValue)
				})
				await Promise.all(newFilesPromises)
			}
			//update 'files' if there's deleted photos
			if (deleted_id) {
				deleted_id = deleted_id.split(",")
				deleted_id.splice(-1, 1)
				let filesToRemovePromises = deleted_id.map(idToDel => File.find(idToDel))
				filesToRemovePromises = await Promise.all(filesToRemovePromises)
				//**notice that is essential to delete the file from the db
				//**this differ from the "Product.delete" because there, deleting
				//**the user deletes in cascade the files
				const removedFilesPromises = filesToRemovePromises.map(file => {
					try {
						if (file.path != 'public/images/placeholder.png')
							unlinkSync(file.path)
						return File.delete(file.id)
					}
					catch (error) {
						console.error(error)
					}
				})
				await Promise.all(removedFilesPromises)
			}
			//update 'products' with the product values
			await Product.update(id, {
				category_id,
				name,
				description,
				old_price,
				price,
				quantity,
				status
			})

			return res.redirect(`products/${id}`)
		}
		catch (error) {
			console.error(error)
			return res.render("home/index", {
				error: "Erro ao tentar atualizar receita. Por favor, tente novamente.",
			})
		}
	},
	async delete(req, res) {
		try {
			//find all the files related to the product
			const { id: productId } = req.body
			const files = await Product.files(productId)
			//delete the product (in cascade, will delete the files from db)
			await Product.delete(productId)
			//delete all the files related to the product that are saved on the folder "images"
			//this is only made after removing the product
			files.map(file => {
				try {
					if (file.path != 'public/images/placeholder.png')
						unlinkSync(file.path)
				}
				catch (error) {
					console.error(error)
				}
			})

			return res.render("home/index", {
				success: "Produto deletado com sucesso."
			})
		}
		catch (error) {
			console.error(error)
			return res.render("home/index", {
				error: "Erro ao tentar deletar receita. Por favor, tente novamente.",
			})
		}
	}
}