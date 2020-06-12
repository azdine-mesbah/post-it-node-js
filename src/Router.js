const router = require('express').Router()
const homeRouter = require('./routers/homeRouter')
const authRouter = require('./routers/authRouter')
const usersRouter = require('./routers/usersRouter')
const followsRouter = require('./routers/followRouter')
const postsRouter = require('./routers/postsRouter')
const apiRouter = require('./routers/apiRouter')
const testRouter = require('./routers/testRouter')

const isAuthenticated = require('./middlewares/isAuthenticated')



router.use('/test', testRouter)
router.use('/', homeRouter)
router.use('/auth', authRouter)
router.use('/users', isAuthenticated, usersRouter)
router.use('/follows',isAuthenticated, followsRouter)
router.use('/posts', postsRouter)
router.use('/api', apiRouter)



module.exports = router