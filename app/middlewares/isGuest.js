module.exports = (req, res, next) => {
	if(req.session.isAuth) {
		res.redirect("/")
	} else {
		next()
	}
}