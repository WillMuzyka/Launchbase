const Category = require("../../models/Category")
const Product = require("../../models/Product")

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

		let results = await Product.create(values)
		const productID = results.rows[0].id

		return res.redirect(`products/${productID}`)
	},
	async edit(req, res) {
		let results = await Product.find(req.params.id)
		const product = results.rows[0]
		if (!product) return res.render("err", { errorText: "ID not found" })

		product.price = formatPrice(product.price)

		results = await Category.all()
		const categories = results.rows

		return res.render("products/edit", { product, categories })
	},
	async put(req, res) {
		let old_price = req.body.old_price
		const price = req.body.price.replace(/\D/g, '')

		const oldProduct = await Product.find(req.body.id)
		if (price != oldProduct.rows[0].price) {
			old_price = oldProduct.price
		}

		const values = [
			req.body.category_id,
			req.body.user_id || 1,
			req.body.name,
			req.body.description,
			old_price,
			price,
			req.body.quantity,
			req.body.status || 1,
			updated = date(Date.now()).db,
			req.body.id
		]

		await Product.update(values)

		return res.redirect(`products/${req.body.id}/edit`)
	},
	async delete(req, res) {
		await Product.delete(req.body.id)
		return res.redirect("/products/create")
	}
}