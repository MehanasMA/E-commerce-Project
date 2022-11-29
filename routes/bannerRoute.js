const express = require('express')
const router = express()
const cloudinary = require('../cloudinary')
const multer = require('multer')

const { storage } = require('../cloudinary')
const upload = multer({ storage })

const {
setBanner,
addBanner,
saveBanner
} = require('../controllers/bannerController')

// const {
// adminSessionCheckHomePage
// } = require('../middleware/auth')

router.get('/setBanner', setBanner)
router.get('/addBanner', addBanner)
router.post('/addBanner/add', upload.array('image'), saveBanner)

module.exports = router