const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/models/User')
const Product = require('./src/models/Product')
const File = require('./src/models/File')

let userIds = []
let productsIds = []
let totalUsers = 3
let totalProducts = 10

async function createUsers() {
	let users = []
	const password = await hash("asd", 8)
	while (users.length < totalUsers) {
		users.push({
			name: faker.name.firstName(),
			email: faker.internet.email(),
			password,
			cpf_cnpj: faker.random.number(99999999999),
			cep: faker.random.number(99999999),
			address: faker.address.streetName(),
		})
	}
	const usersPromises = users.map(user => User.create(user))
	userIds = await Promise.all(usersPromises)
}

async function createProducts() {
	let products = []
	while (products.length < totalProducts) {
		products.push({
			category_id: Math.ceil(Math.random() * 5),
			user_id: userIds[Math.floor(Math.random() * totalUsers)],
			name: faker.name.firstName(),
			description: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
			old_price: faker.random.number(9999),
			price: faker.random.number(9999),
			quantity: faker.random.number(99),
			status: Math.round(Math.random())
		})
	}
	const productsPromises = products.map(product => Product.create(product))
	productsIds = await Promise.all(productsPromises)

	let files = []
	while (files.length < 50) {
		files.push({
			name: faker.image.image(),
			path: `public/images/placeholder.png`,
			product_id: productsIds[Math.floor(Math.random() * totalProducts)],
		})
	}
	const filesPromises = files.map(file => File.create(file))
	await Promise.all(filesPromises)
}

async function init() {
	await createUsers()
	await createProducts()
}

init()