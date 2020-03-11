const express = require('express')
const routes = express.Router()
const teachers = require('./src/teachers')

routes.get("/", (req, res) => res.redirect("/teachers"))

/* TEACHER */
routes.get("/teachers", (req, res) => res.render("teachers/index"))

routes.get("/teachers/create", teachers.create)

routes.post("/teachers", teachers.post)

/* STUDENT */
routes.get("/students", (req, res) => res.render("students/index"))

module.exports = routes