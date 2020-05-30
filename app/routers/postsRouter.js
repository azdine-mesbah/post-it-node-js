const router = require('express').Router()
const postsController = require('../controllers/postsController')

const isAuthenticated = require('../middlewares/isAuthenticated')
const isAuthorized = require('../middlewares/postAuthorized')

router.get('/show/:_id', postsController.show)
router.get('/create',isAuthenticated, postsController.create)
router.post('/create', isAuthenticated,  postsController.save)
router.get('/edit/:_id', isAuthenticated, isAuthorized, postsController.edit)
router.post('/edit/:_id', isAuthenticated, isAuthorized, postsController.update)
router.post('/delete/:_id', isAuthenticated, isAuthorized,  postsController.delete)



module.exports = router