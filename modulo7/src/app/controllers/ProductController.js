const Category = require("../../models/Category")
const Product = require("../../models/Product")
const File = require("../../models/File")

const { date, formatPrice } = require("../../lib/utils")

module.exports = {
	async create(req, res) {
		const results = await Category.all()
		const categories = results.rows

		return res.render("products/create", { categories })
	},
	async post(req, res) {
		const price = req.body.price.replace(/\D/g, '')
		const values = [
			req.body.category_id,
			req.body.user_id || 1,
			req.body.name,
			req.body.description,
			req.body.old_price || price,
			price,
			req.body.quantity,
			req.body.status || 1,
		]

		if (req.files.length == 0) {
			return res.send('Please, send at least one image')
		}

		let results = await Product.create(values)
		const productID = results.rows[0].id


		const filesPromise = req.files.map(file => {
			fileValues = [
				file.filename,
				file.path,
				productID,
			]
			return File.create(fileValues)
		})
		await Promise.all(filesPromise)

		return res.redirect(`products/${productID}`)
	},
	async show(req, res) {
		let results = await Product.find(req.params.id)
		const product = results.rows[0]
		if (!product) return res.render("err", { errorText: "ID not found" })

		results = await Product.files(req.params.id)
		const files = results.rows.map(file => ({
			...file,
			src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
		}))

		product.published = date(product.updated_at).show
		product.old_price = formatPrice(product.old_price)
		product.price = formatPrice(product.price)

		return res.render("products/show", { product, files })
	},
	async edit(req, res) {
		let results = await Product.find(req.params.id)
		const product = results.rows[0]
		if (!product) return res.render("err", { errorText: "ID not found" })

		product.price = formatPrice(product.price)

		results = await Category.all()
		const categories = results.rows

		results = await Product.files(product.id)
		let files = results.rows

		files = files.map(file => ({
			...file,
			src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
		}))

		return res.render("products/edit", { product, categories, files })
	},
	async put(req, res) {
		let { old_price, deleted_id } = req.body
		const price = req.body.price.replace(/\D/g, '')

		//update old_price
		let results = await Product.find(req.body.id)
		const oldProduct = results.rows[0]
		if (price != oldProduct.price) {
			old_price = oldProduct.price
		}

		//update 'files' if there's new photos
		if (req.files.length > 0) {
			const newFilesPromises = req.files.map(file => {
				newFilesValue = [
					file.filename,
					file.path,
					req.body.id,
				]
				return File.create(newFilesValue)
			})
			await Promise.all(newFilesPromises)
		}

		//update 'files' if there's deleted photos
		if (deleted_id) {
			deleted_id = deleted_id.split(",")
			deleted_id.splice(-1, 1)
			const removedFilesPromises = deleted_id.map(id => File.delete(id))
			await Promise.all(removedFilesPromises)
		}

		//update 'products' with the product values
		const values = [
			req.body.category_id,
			req.body.user_id || 1,
			req.body.name,
			req.body.description,
			old_price,
			price,
			req.body.quantity,
			req.body.status || 1,
			req.body.id
		]

		await Product.update(values)


		return res.redirect(`products/${req.body.id}`)
	},
	async delete(req, res) {
		await Product.delete(req.body.id)
		return res.redirect("/products/create")
	}
}