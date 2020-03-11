const express = require('express')
const nunjucks = require('nunjucks')

const links = require('./sources/links.js')
const courses = require('./sources/courses')
const about = require('./sources/about')

const server = express()

server.use(express.static('public'))
server.set('view engine', 'njk')

nunjucks.configure('views', {
	express: server
})

let counter = 0;

server.get('/', (req, res) => {
	return res.render('layout', { links })
})

server.get('/courses', (req, res) => {
	return res.render('courses', { courses, links })
})

server.get('/courses/:id', (req, res) => {
	const course = courses.find(c => c.id == req.params.id)
	const newCourses = []
	console.log(course)
	return !course ? res.send("deu ruim") : (
		newCourses.push(course),
		counter++ ,
		isSingleCourse = true,
		res.render('courses', { courses: newCourses, links, isSingleCourse })
	)
})

server.get('/about', (req, res) => {
	return res.render('about', { about, links })
})

server.use(function (req, res) {
	res.status(404).render("not-found", { links })
})

server.listen(5000, () => {
	console.log("Server runing")
})