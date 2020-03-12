const express = require('express')
const routes = express.Router()
const teachers = require('./src/teachers')

routes.get("/", (req, res) => res.redirect("/teachers"))

/* TEACHER */
routes.get("/teachers", (req, res) => res.render("teachers/index"))

routes.get("/teachers/create", teachers.create)

routes.get("/teachers/:id", teachers.show)

routes.get("/teachers/:id/edit", teachers.edit)

routes.post("/teachers", teachers.post)

routes.put("/teachers", teachers.update)

routes.delete("/teachers", teachers.delete)

/* STUDENT */
routes.get("/students", (req, res) => res.render("students/index"))

module.exports = routes