const express = require('express')
const routes = express.Router()
const teachers = require('./src/teachers')

routes.get("/", (req, res) => res.redirect("/teachers"))

/* TEACHER */
//index
routes.get("/teachers", teachers.index)
//create
routes.get("/teachers/create", teachers.create)
//show
routes.get("/teachers/:id", teachers.show)
//edit
routes.get("/teachers/:id/edit", teachers.edit)
//post
routes.post("/teachers", teachers.post)
//update
routes.put("/teachers", teachers.update)
//delete
routes.delete("/teachers", teachers.delete)

/* STUDENT */
routes.get("/students", (req, res) => res.render("students/index"))

module.exports = routes