const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

const users = require('./users')
const products = require('./products')
routes.use('/users', users)
routes.use('/products', products)

//HOME
routes.get("/", HomeController.index)

// Alias
routes.get("/ads/create", (req, res) => res.redirect("/products/create"))
routes.get("/accounts", (req, res) => res.redirect("/users/login"))

module.exports = routes