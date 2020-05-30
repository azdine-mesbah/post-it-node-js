const router = require('express').Router()
const cors = require('cors') // allow cross origin resource sharing
const searchController = require('../api/controllers/searchController')
router.use(cors())

router.post('/search', searchController.search)


module.exports = router