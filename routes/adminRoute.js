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


admin_route.get("/adminlogin", adminController.addadmin);

admin_route.post("/adminloginpost", adminController.addadminpost);

admin_route.get("/dashboard", adminController.adminhome);

admin_route.get("/accounts", adminController.account);

// admin_route.get("/editproduct", adminController.editproductget)

// admin_route.post("/editProduct", adminController.editproductpost)

admin_route.get("/userManageget", adminController.userManageget)

// admin_route.get("/userStateblock/:id", adminController.userStateblock);

// admin_route.get("/userStateUnblock/:id", adminController.userStateUnblock);

admin_route.put('/editUser/:id', adminController.editUser)

admin_route.post('/logout', adminController.logout)




module.exports = admin_route