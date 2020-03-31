const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')
const Validator = require('../app/validators/user')

// //LOGIN LOGOUT
// routes.get('/login', SessionController.loginForm)
// routes.post('/login', SessionController.login)
// routes.post('/logout', SessionController.logout)

// //RESET PASSWORD
// routes.get('/forgot-password', SessionController.forgotForm)
// routes.get('/password-reset', SessionController.resetForm)
// routes.post('/forgot-password', SessionController.forgot)
// routes.post('/password-reset', SessionController.reset)

// //REGISTER USER
routes.get('/register', UserController.registerForm)
routes.post('/register', Validator.post, UserController.post)

// //SHOW
routes.get('/', UserController.show)
// routes.post('/', UserController.update)
// routes.delete('/', UserController.delete)

module.exports = routes