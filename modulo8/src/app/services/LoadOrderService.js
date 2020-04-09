const Order = require("../../models/Order")
const User = require("../../models/User")
const LoadProductService = require("./LoadProductService")

const { date, formatPrice } = require("../../lib/utils")

async function format(order) {
	order.product = await LoadProductService.load("productWithDeleted", {
		where: { id: order.product_id }
	})

	order.buyer = await User.findOne({
		where: { id: order.buyer_id }
	})

	order.seller = await User.findOne({
		where: { id: order.seller_id }
	})

	order.formattedPrice = formatPrice(order.price)
	order.formattedTotal = formatPrice(order.total)

	const statusOptions = {
		open: "Aberto",
		sold: "Vendido",
		canceled: "Cancelado"
	}

	order.formattedStatus = statusOptions[order.status]
	const updatedAt = date(order.updated_at).show
	order.formattedUpdatedAt = `${order.formattedStatus} em ${updatedAt}`

	return order
}

const LoadService = {
	load(service, filters) {
		this.filters = filters
		return this[service]()
	},
	async order() {
		try {
			//find the order
			let order = await Order.findOne(this.filters)
			return format(order)
		} catch (error) {
			console.error(error);
		}
	},
	async orders() {
		try {
			//find the order
			let orders = await Order.findAll(this.filters)
			const ordersPromises = orders.map(format)
			return Promise.all(ordersPromises)
		} catch (error) {
			console.error(error);
		}
	},
	format,
}

module.exports = LoadService