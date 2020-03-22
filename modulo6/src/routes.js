const express = require('express')
const routes = express.Router()
const productController = require('./app/controllers/productController')

routes.get("/", (req, res) => { res.render("layout") })

routes.get("/products/create", productController.create)
routes.post("/products", productController.post)
routes.get("/products/:id/edit", productController.edit)
routes.put("/products", productController.put)
routes.delete("/products", productController.delete)




routes.get("/ads/create", (req, res) => res.redirect("/products/create"))


module.exports = routes