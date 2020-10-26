const { isEmpty, trim, escape } = require('validator')
const xss = require('xss')
const User = require('../models/User')
const Note = require('../models/Note')
const _ = require('lodash')

module.exports = {

  createNote: (req, res) => {
	   	let { title, content } = req.body
    if (isEmpty(title)) {
      req.flash('error', 'Note Title cannot be empty')
      res.redirect('/')
    } else {
      title = xss(trim(escape(title)))
      content = xss(trim(escape(content)))
      const note = new Note({ title, content, user: req.user._id })
      note.save().then(note => {
        if (note) {
          User.updateOne({ _id: req.user._id }, { $push: { notes: note._id } }).then(user => {
            if (user) {
              res.redirect(`/note/${note._id}`)
            } else {
              req.flash('error', 'Unable to complete your request, please try again')
              res.redirect('/')
            }
          }).catch(e => {
            req.flash('error', 'A server error occured, please try again' + e)
            res.redirect('/')
          })
        } else {
          req.flash('error', 'Unable to complete your request, please try again')
          res.redirect('/')
        }
      }).catch(e => {
        req.flash('error', 'A server error occured, please try again' + e)
        res.redirect('/')
      })
    }
  },

  getSingleNote: (req, res) => {
    const data = {
      title: 'view Note',
      csrf: req.csrfToken(),
      currentUser: req.user
    }
    Note.findOne({ _id: req.params.id, user: req.user._id }).populate('user').exec().then(note => {
      if (note) {
        data.note = note
      } else {
        data.note = null
      }
      res.render('note/show', data)
    }).catch(e => {
      res.send(e)
    })
  },

  updateNote: (req, res) => {
    let { title, content } = req.body
    if (isEmpty(title)) {
      req.flash('error', 'Note Title cannot be empty')
      res.redirect('/')
    } else {
      title = xss(trim(escape(title)))
      content = xss(trim(escape(content)))
      const note = new Note({ title, content, user: req.user._id })
      Note.updateOne({ _id: req.params.id, user: req.user._id }, { title, content })
        .then(note => {
          if (note) {
            res.redirect(`/note/${req.params.id}`)
          } else {
            req.flash('error', 'An error occured while updating your note')
            res.redirect(`/note/${req.params.id}`)
          }
        }).catch(e => {
          req.flash('error', 'A server error occured, please try again')
          res.redirect(`/note/${req.params.id}`)
        })
    }
  },

  deleteNote: (req, res) => {
    Note.deleteOne({ _id: req.params.id, user: req.user._id }, (err) => {
      if (!err) {
        return res.redirect('/')
      } else {
        req.flash('error', 'A server error occured, please try again ' + err)
        return res.redirect(`/note/${req.params.id}`)
      }
    })
  }
}
