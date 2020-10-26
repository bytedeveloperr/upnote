const router = require("express").Router()
const AuthController = require("../controllers/AuthController")
const isGuest = require("../middlewares/isGuest")
const isAuth = require("../middlewares/isAuth")

router.get("/login", isGuest, AuthController.loginForm)
router.get("/register", isGuest, AuthController.registerForm)
router.post("/login", isGuest, AuthController.handleLogin)
router.post("/register", isGuest, AuthController.handleRegister)
router.get("/logout", isAuth, (req, res) => {
	req.session.destroy()
	res.redirect('/login')
})

module.exports = router