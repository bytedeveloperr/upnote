const { isEmpty, isEmail, normalizeEmail, isLength, trim, escape } = require("validator")
const xss = require("xss")
const argon2 = require("argon2")
const User = require("../models/User")
const _ = require("lodash")

module.exports = {

	loginForm: (req, res) => {
		let data = {
			title: "Login",
			csrf: req.csrfToken()
		}
		res.render("login", data)
	},

	registerForm: (req, res) => {
		let data = {
			title: "Register",
			csrf: req.csrfToken()
		}
		res.render("register", data)
	},

	handleLogin: (req, res) => {
		let { email, password } = req.body
		if (isEmpty(email) || isEmpty(password)) {
			req.flash("error", "All fields are required")
			res.redirect("/login")
		} else {
			if (!isEmail(email)) {
				req.flash("error", "Enter a valid email")
				res.redirect("/login")
			} else {
				if (!isLength(password, { min: 6 })) {
					req.flash("error", "Password must not be less than six characters")
					res.redirect("/login")
				} else {
					email = xss(trim(escape(normalizeEmail(email))))
					password = xss(trim(escape(password)))
					User.findOne({ email }).then(user => {
						if(user) {
							argon2.verify(user.password, password).then(result => {
								if (result) {
									req.session.isAuth = true
									req.session.user = _.pick(user, ['_id', 'name'])
									res.redirect('/')
								} else {
									req.flash("error", "Password is incorrect")
									res.redirect("/login")
								}
							}).catch(e => {
								req.flash("error", "A server error occured, please try again" + e)
								res.redirect("/login")
							})
						} else {
							req.flash("error", "The email is not registered with us")
							res.redirect("/login")
						}
					}).catch(e => {
						req.flash("error", "A server error occured, please try again" + e)
						res.redirect("/login")
					})
				}
			}
		}
 	},

	handleRegister: (req, res) => {
		let { name, email, password } = req.body
		if (isEmpty(name) || isEmpty(email) || isEmpty(password)) {
			req.flash("error", "All fields are required")
			res.redirect("/register")
		} else {
			if (!isEmail(email)) {
				req.flash("error", "Enter a valid email")
				res.redirect("/register")
			} else {
				if (!isLength(password, { min: 6 })) {
					req.flash("error", "Password must not be less than six characters")
					res.redirect("/register")
				} else {
					name = xss(trim(escape(name)))
					email = xss(trim(escape(normalizeEmail(email))))
					password = xss(trim(escape(password)))
					User.findOne({ email }).then(user => {
						if(user) {
							req.flash("error", "The email is already linked to an account")
							res.redirect("/register")
						} else {
							argon2.hash(password).then(hash => {
								let user = new User({ name, email, password: hash })
								user.save().then(user => {
									if (user) {
										req.session.isAuth = true
										req.session.user = _.pick(user, ['_id', 'name'])
										res.redirect('/')
									} else {
										req.flash("error", "Unable to register due to some errors, please try again" + e)
										res.redirect("/register")
									}
								}).catch(e => {
									req.flash("error", "A server error occured, please try again" + e)
									res.redirect("/register")
								})
							}).catch(e => {
									req.flash("error", "A server error occured, please try again" + e)
									res.redirect("/register")
							})
						}
					}).catch(e => {
						req.flash("error", "A server error occured, please try again" + e)
						res.redirect("/register")
					})
				}
			}
		}
	}
}