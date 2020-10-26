const Note = require("../models/Note")
const { format } = require('timeago.js');

module.exports = {

	dashboard: (req, res) => {
		Note.find({ user: req.session.user._id }).populate("user").exec()
		.then(notes => {
				let data = {
				title: "Dashboard",
				csrf: req.csrfToken(),
				notes: notes,
				format: format
			}
			
			res.render("dashboard", data)
		})
	}
}