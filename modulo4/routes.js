const express = require('express')
const routes = express.Router()
const instructors = require('./src/instructors')

routes.get("/", (req, res) => res.redirect("/instructors"))

routes.get("/instructors", (req, res) => res.render("instructors/index"))

routes.get("/instructors/create", (req, res) => res.render("instructors/create"))

routes.get("/instructors/:id", instructors.show)

routes.get("/instructors/:id/edit", instructors.edit)

routes.post("/instructors", instructors.post)

routes.put("/instructors", instructors.put)

routes.delete("/instructors", instructors.delete)

routes.get("/members", (req, res) => {
	return res.render("members/index")
})

module.exports = routes