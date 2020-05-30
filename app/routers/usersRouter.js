const router = require('express').Router()
const usersController = require('../controllers/usersController')

router.get('/profile/:username', usersController.profile)
router.get('/edit', usersController.edit)
router.post('/edit', usersController.update)

module.exports = router