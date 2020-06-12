const router = require('express').Router()
const followsController = require('../controllers/followsController')

router.post('/follow/:_id', followsController.follow)
router.post('/unfollow/:_id', followsController.unfollow)

module.exports = router