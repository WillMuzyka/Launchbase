const express = require('express')
const routes = express.Router()

const OrderController = require('../app/controllers/OrderController')

const { onlyUsers } = require('../app/middlewares/session')

//ORDER
routes.post('/', onlyUsers, OrderController.post)
	.get('/', onlyUsers, OrderController.index)
	.get('/sales', onlyUsers, OrderController.sales)
	.get('/:id', onlyUsers, OrderController.show)
	.post('/:id/:action', onlyUsers, OrderController.update)

module.exports = routes