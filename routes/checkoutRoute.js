const express = require('express')
const router = express()

const {
    checkoutPage,
    placeOrder,
    orderSuccess,
    verifyPay,
    viewOrders,
    orderedProducts,
    checkoutAddress,
    cancelOrder
} = require('../controllers/checkoutController')

const {
    sessionCheckHomePage
} = require('../middleware/auth')

router.get('/checkout/:id', checkoutPage)
router.post('/placeOrder', sessionCheckHomePage, placeOrder)
router.get('/orderSuccess', orderSuccess)
router.post('/verifyPay', verifyPay)
router.get('/viewOrders', viewOrders)
router.post('/orderedProducts',  orderedProducts)
router.get('/checkoutAddress',  checkoutAddress)
router.put('/cancelOrder/:id', cancelOrder)

module.exports = router