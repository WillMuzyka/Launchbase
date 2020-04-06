const Category = require('../../models/Category')

module.exports = {
	async post(req, res, next) {
		try {
			//if reloading is necessary, load the categories
			let categories = await Category.findAll()
			//verify if all inputs have something
			const keys = Object.keys(req.body)
			for (key of keys) {
				if (key != "deleted_id" && req.body[key] == "") {
					return res.render("products/create", {
						error: "Por favor, preencha todos os campos",
						categories,
						product: req.body
					})
				}
			}
			//verify if there's at least one image
			if (!req.files || req.files.length == 0) {
				return res.render("products/create", {
					error: "Envie ao menos uma imagem.",
					categories,
					product: req.body
				})
			}

			next()
		} catch (error) {
			console.error(error);
		}
	},
	async put(req, res, next) {
		try {
			//if reloading is necessary, load the categories
			let categories = await Category.findAll()
			//check if all the inputs were filled
			const keys = Object.keys(req.body)
			for (key of keys) {
				if (key != "deleted_id" && req.body[key] == "")
					return res.send("Por favor, preencha todos os campos")
			}

			next()
		} catch (error) {
			console.error(error);
		}
	}
}