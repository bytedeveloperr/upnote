require("dotenv").config()
require("./app/config/database")
const express = require("express")
const ejsMate = require("ejs-mate")
const path = require("path")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("express-flash")
const MongoStore = require("connect-mongodb-session")(session)
const csurf = require("csurf")
const methodOverride = require("method-override")

const routes = require("./app/routes")

const app = express()

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "app/views"))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		uri: process.env.MONGO_URI,
		collection: "sessions"
	})
}))
app.use(flash())
app.use(csurf({ cookie: true }))
app.use(methodOverride("_method"))
app.use(routes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("listening on port 3000"))