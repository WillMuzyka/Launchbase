const express = require('express')
const nunjucks = require('nunjucks')

const server = express()

server.use(express.static('public'))
server.set('view engine', 'njk')

nunjucks.configure('views', {
	express: server
})

server.get('/', (req, res) => {
	return res.render('layout')
})

server.get('/courses', (req, res) => {
	return res.render('courses')
})

server.get('/about', (req, res) => {
	return res.render('about')
})

server.use(function (req, res) {
	res.status(404).render("not-found");
});

server.listen(5000, () => {
	console.log("Server runing")
})