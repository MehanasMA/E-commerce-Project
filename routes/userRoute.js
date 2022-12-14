const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const { sessionCheckHomePage }=require('../middleware/auth')

const userRoute = express.Router();

// userRoute.set('views', './views/userpages')

userRoute.use(express.static("public"));

userRoute.get("/",userController.home);

userRoute.post("/loginPost", userController.loginPost);

userRoute.post("/signupPost", userController.signupPost);

userRoute.get("/myaccount", userController.myaccount);

userRoute.get("/category", userController.category);

userRoute.get("/shop",userController.shop);

userRoute.get("/blog", userController.blog);

userRoute.get("/about", userController.about);

// userRoute.delete('/deleteAddress/:id', userController.deleteAddress)


userRoute.get("/contact", userController.contact);

userRoute.get("/addAddress", userController.addAddress);

userRoute.post("/saveAddress/:id", userController.saveAddress);

userRoute.post("/verify", userController.verify);

userRoute.get("/otpget", userController.otpget)

userRoute.post("/catagorySort", userController.catagorySort);

userRoute.get("/logout", userController.logout);







module.exports = userRoute;