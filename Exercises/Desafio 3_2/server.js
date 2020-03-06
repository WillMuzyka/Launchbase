const express = require('express')
const nunjucks = require('nunjucks')

const server = express()

server.use(express.static('public'))
server.set('view engine', 'njk')

nunjucks.configure('views', {
	express: server
})

const links = {
	top_links: [
		{
			url: "/courses",
			name: "Conteúdos"
		},
		{
			url: "https://discordapp.com/invite/gCRAFhc",
			name: "Comunidade"
		},
		{
			url: "mailto:oi@rocketseat.com.br",
			name: "Email"
		},
		{
			url: "tel:+5547992078767",
			name: "Telefone"
		},
		{
			url: "/about",
			name: "Sobre"
		}
	],
	bottom_links: [
		{
			url: "https://rocketseat.com.br/",
			name: "Rocketseat"
		},
		{
			url: "https://www.instagram.com/rocketseat_oficial/",
			name: "Instagram"
		},
		{
			url: "https://pt-br.facebook.com/rocketseat/",
			name: "Facebook"
		},
		{
			url: "https://github.com/Rocketseat",
			name: "Github"
		}
	]
}

server.get('/', (req, res) => {
	return res.render('layout', { links })
})

server.get('/courses', (req, res) => {
	const courses = [
		starter = {
			id: "Starter",
			img_url: "https://skylab.rocketseat.com.br/static/64c237ccff807c054339a62d53b4b402.svg",
			info: "Cursos 100% online e gratuitos para você entrar com o pé direito nas tecnologias mais desejadas do mercado.",
			price: "Free"
		},
		launchbase = {
			id: "Launchbase",
			img_url: "https://skylab.rocketseat.com.br/static/0828532024cb46921a6b5e941f8d788d.svg",
			info: "Domine programação do zero e tenha acesso às melhores oportunidades do mercado no menor tempo possível.",
			price: "Pago"
		},
		gostack = {
			id: "GoStack",
			img_url: "https://skylab.rocketseat.com.br/static/83a178a0653dab1d55e2ed7946465975.svg",
			info: "Treinamento imersivo nas tecnologias mais modernas de desenvolvimento web e mobile para quem não tem tempo a perder.",
			price: "Pago"
		}

	]
	return res.render('courses', { courses, links })
})

server.get('/about', (req, res) => {
	const about = {
		rocket_img_url: "https://rocketseat.com.br/static/images/logo-rocketseat.svg",
		name: "Rocketseat",
		info: "No meio de tanta informação e da quantidade de ferramentas que surgem todos os dias, você precisa de alguém que te leve na direção certa.",
		techs: [
			{ name: "Node.js" },
			{ name: "React" },
			{ name: "ReactNative" }
		]
	}
	return res.render('about', { about, links })
})

server.use(function (req, res) {
	res.status(404).render("not-found");
});

server.listen(5000, () => {
	console.log("Server runing")
})