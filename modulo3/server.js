const express = require('express')
const nunjucks = require('nunjucks')
const videosData = require('./sources/videosData.js')
const aboutData = require('./sources/aboutData.js')

const server = express()
const a = 10

server.use(express.static("public"))

server.set("view engine", "njk")

nunjucks.configure("views", {
	express: server,
	autoescape: false,
	noCache: true
})

server.get("/", (req, res) => {
	return res.render("about", { about: aboutData })
})

server.get("/videos", (req, res) => {
	return res.render("videos", { items: videosData })
})

server.get("/video", (req, res) => {
	const id = req.query.id
	const video = videosData.find((vid) => vid.id == id)
	!video ? res.send("Video not found!") : res.render("video", { item: video })
})

server.listen(5000, () => {
	console.log("server is runing")
})