const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ProductController = require('../app/controllers/ProductController')
const SearchController = require('../app/controllers/SearchController')

const uploadLimit = 6

//SEARCH
routes.get("/search", SearchController.index)

//PRODUCTS
routes.get("/create", ProductController.create)
routes.get("/:id", ProductController.show)
routes.get("/:id/edit", ProductController.edit)

//PRODUCTS DB
routes.post("/", multer.array("photos", uploadLimit), ProductController.post)
routes.put("/", multer.array("photos", uploadLimit), ProductController.put)
routes.delete("/", ProductController.delete)

module.exports = routes