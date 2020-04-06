const LoadProductService = require("../services/LoadProductService")

module.exports = {
	async index(req, res) {
		try {
			const allProducts = await LoadProductService.load('products')
			const products = allProducts.filter((product, index) => index < 3)

			return res.render("home/index", { products })
		} catch (error) {
			console.error(error)
		}
	}
}