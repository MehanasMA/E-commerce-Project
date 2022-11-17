const express = require('express')
const router = express()

const wishListController= require('../controllers/wishListController')

const {
    sessionCheckHomePage
} = require('../middleware/auth')

router.post('/addToWishlist/:id', sessionCheckHomePage,  wishListController.addToWishlist)
router.get('/wishlist', sessionCheckHomePage,  wishListController.userWishlist)
router.delete('/deleteWishlistItem/:id', sessionCheckHomePage,  wishListController.deleteWishlist)

module.exports = router 