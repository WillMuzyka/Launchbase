const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

const productController = require('./app/controllers/productController')

const uploadLimit = 6

routes.get("/", (req, res) => { res.render("layout") })

routes.get("/products/create", productController.create)
routes.get("/products/:id", productController.show)
routes.get("/products/:id/edit", productController.edit)

routes.post("/products", multer.array("photos", uploadLimit), productController.post)
routes.put("/products", multer.array("photos", uploadLimit), productController.put)
routes.delete("/products", productController.delete)

// Alias
routes.get("/ads/create", (req, res) => res.redirect("/products/create"))


module.exports = routes