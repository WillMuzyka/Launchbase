const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

const ProductController = require('./app/controllers/ProductController')
const HomeController = require('./app/controllers/HomeController')
const SearchController = require('./app/controllers/SearchController')

const uploadLimit = 6
//HOME
routes.get("/", HomeController.index)

//SEARCH
routes.get("/products/search", SearchController.index)

//PRODUCTS
routes.get("/products/create", ProductController.create)
routes.get("/products/:id", ProductController.show)
routes.get("/products/:id/edit", ProductController.edit)

routes.post("/products", multer.array("photos", uploadLimit), ProductController.post)
routes.put("/products", multer.array("photos", uploadLimit), ProductController.put)
routes.delete("/products", ProductController.delete)

// Alias
routes.get("/ads/create", (req, res) => res.redirect("/products/create"))



module.exports = routes