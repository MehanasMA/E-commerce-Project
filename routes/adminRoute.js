const express = require('express')
const { model } = require('mongoose')
// const auth = require("../middleware/auth")



const admin_route = express()


admin_route.set('view engine', 'ejs')
admin_route.set('views', './views/admintemplate')
const bodyParser = require('body-parser')

admin_route.use(express.static('public/Adminpublic'))

admin_route.use(bodyParser.json())
admin_route.use(bodyParser.urlencoded({ extended: true }))

const adminController = require('../controllers/adminController')
const couponController=require("../controllers/couponController")


admin_route.get("/adminlogin", adminController.addadmin);

admin_route.post("/adminloginpost", adminController.addadminpost);

admin_route.get("/dashboard", adminController.adminhome);

admin_route.get("/accounts", adminController.account);

// admin_route.get("/editproduct", adminController.editproductget)

// admin_route.post("/editProduct", adminController.editproductpost)

admin_route.get("/userManageget", adminController.userManageget)


admin_route.put('/editUser/:id', adminController.editUser)

admin_route.post('/logout', adminController.logout)


admin_route.get('/orders', adminController. productOrders)

admin_route.post('/orderitems', adminController.orderItems)

// admin_route.get('/editOrders/:id', adminController.editOrder)

admin_route.post('/updateOrder/:id', adminController.updateOrder)

admin_route.get('/orders', adminController.productOrders)

admin_route.post('/orderitems', adminController.orderItems)

admin_route.get("/coupon", couponController.adminCouponPage);

admin_route.get('/categoryBrand',adminController.categoryBrand)

admin_route.post("/coupon", couponController.couponAdd);

admin_route.delete("/coupon", couponController.couponDelete);

admin_route.post('/applyCoupen/:id', couponController.applyCoupen)



module.exports = admin_route