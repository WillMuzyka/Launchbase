const Category = require("../../models/Category")
const Product = require("../../models/Product")
const File = require("../../models/File")

const { date, formatPrice } = require("../../lib/utils")

module.exports = {
	async create(req, res) {
		try {
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
			//if reloading is necessary, load the categories
			let categories = await Category.findAll()
			//verify if all inputs have something
			const keys = Object.keys(req.body)
			for (key of keys) {
				if (key != "deleted_id" && req.body[key] == "") {
					return res.render("products/create", {
						error: "Por favor, preencha todos os campos",
						categories,
						product: req.body
					})
				}
			}
			//verify if there's at least one image
			if (req.files.length == 0) {
				return res.render("products/create", {
					error: "Envie ao menos uma imagem.",
					categories,
					product: req.body
				})
			}

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
			const product = await Product.find(req.params.id)
			if (!product) return res.render("err", { errorText: "ID not found" })

			let files = await Product.files(req.params.id)
			files = files.map(file => ({
				...file,
				src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
			}))

			product.published = date(product.updated_at).show
			product.old_price = formatPrice(product.old_price)
			product.price = formatPrice(product.price)

			return res.render("products/show", { product, files })
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
			let product = await Product.find(req.params.id)
			const categories = await Category.findAll()

			let files = await Product.files(product.id)
			files = files.map(file => ({
				...file,
				src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
			}))

			product.price = formatPrice(product.price)
			return res.render("products/edit", { product, categories, files })
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
			const keys = Object.keys(req.body)
			for (key of keys) {
				if (key != "deleted_id" && req.body[key] == "")
					return res.send("Please fill all fields!")
			}

			let { id, category_id, name, description, old_price,
				price, quantity, status, deleted_id } = req.body
			const price = req.body.price.replace(/\D/g, '')

			//update old_price
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
				const removedFilesPromises = deleted_id.map(idToDel => File.delete(idToDel))
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
			const { id: productId } = req.body
			const files = await Product.files(productId)

			const allFilesPromise = files.map(file => File.delete(file.id))
			await Promise.all(allFilesPromise)

			await Product.delete(productId)
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