const Note = require('../models/Note')
const { format } = require('timeago.js')

module.exports = {

  dashboard: (req, res) => {
    Note.find({ user: req.user._id }).populate('user').exec()
      .then(notes => {
        const data = {
          title: 'Dashboard',
          csrf: req.csrfToken(),
          notes: notes,
          format: format,
          currentUser: req.user
        }

        res.render('dashboard', data)
      })
  }
}
