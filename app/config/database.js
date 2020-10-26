const mongoose = require("mongoose")

mongoose
.connect(process.env.MONOG_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("connected to MongoDB"))
.catch(e => {
	console.log(e)
	throw e
})