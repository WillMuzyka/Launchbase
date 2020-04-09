const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')
const OrderController = require('../app/controllers/OrderController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

const { onlyUsers, ifIsLoggedRedirectToUsers } = require('../app/middlewares/session')

//LOGIN LOGOUT
routes.get('/login', ifIsLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', onlyUsers, SessionController.logout)

//RESET PASSWORD
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

//REGISTER USER
routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post)

//SHOW
routes.get('/', onlyUsers, UserValidator.show, UserController.show)
routes.put('/', onlyUsers, UserValidator.update, UserController.update)
routes.delete('/', onlyUsers, UserController.delete)

//ADS
routes.get('/ads', onlyUsers, UserController.ads)

module.exports = routes