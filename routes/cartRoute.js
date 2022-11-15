const express = require('express')
const router = express()

const {
    userCart,
    addToCart,
    itemInc,
    itemDec,
    itemDelete,
} = require('../controllers/cartController')

const {
    sessionCheckCart
} = require('../middleware/auth')

router.get('/cart/:id', sessionCheckCart, userCart)
router.get('/addToCart/:id', sessionCheckCart, addToCart)
router.post('/itemInc/:id', itemInc)
router.post('/itemDec/:id', itemDec)
router.put('/itemDelete/:id', itemDelete)

module.exports = router