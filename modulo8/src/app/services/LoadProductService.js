const Product = require("../../models/Product")

const { date, formatPrice } = require("../../lib/utils")

async function getImages(productId) {
	//find all the files related to the product, formating the path to src
	let files = await Product.files(productId)
	files = files.map(file => ({
		...file,
		src: `${file.path.replace("public", "")}`
	}))
	return files
}

async function format(product) {
	//get the images of the product
	const files = await getImages(product.id)
	//format the product
	product.img = files[0].src
	product.files = files
	product.published = date(product.updated_at).show
	product.formattedOldPrice = formatPrice(product.old_price)
	product.formattedPrice = formatPrice(product.price)

	return product
}



const LoadService = {
	load(service, filters) {
		this.filters = filters
		return this[service]()
	},
	async product() {
		try {
			//find the product
			const product = await Product.findOne(this.filters)
			return format(product)
		} catch (error) {
			console.error(error);
		}
	},
	async products() {
		try {
			//find the product
			const products = await Product.findAll(this.filters)
			const productsPromise = products.map(format)
			return Promise.all(productsPromise)
		} catch (error) {
			console.error(error);
		}
	},
	format,
}

module.exports = LoadService