const router = require('express').Router()
const IndexController = require('../controllers/IndexController')
const authRoutes = require('./auth')
const noteRoutes = require('./note')

router.get('/', IndexController.dashboard)
router.use('/', authRoutes)
router.use('/note', noteRoutes)

module.exports = router
