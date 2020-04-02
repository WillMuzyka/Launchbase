module.exports = {
	onlyUsers(req, res, next) {
		if (!req.session.userId)
			return res.redirect("/users/login")

		next()
	},
	ifIsLoggedRedirectToUsers(req, res, next) {
		if (req.session.userId)
			return res.redirect("/users")
		next()
	}
}