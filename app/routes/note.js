const router = require('express').Router()
const NoteController = require('../controllers/NoteController')
const isAuth = require('../middlewares/isAuth')

// router.get("/all", NoteController.allNotes)
router.post('/create', isAuth, NoteController.createNote)
router.get('/:id', isAuth, NoteController.getSingleNote)
// router.get("/:id/edit", isAuth, NoteController.editNote)
router.put('/:id', isAuth, NoteController.updateNote)
router.delete('/:id', isAuth, NoteController.deleteNote)

module.exports = router
