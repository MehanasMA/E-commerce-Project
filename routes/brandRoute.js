const express = require('express');
const Brand = require("../models/brandSchema");
const flash = require("connect-flash")



const brandController = require("../controllers/brandController");
const brand_route = express.Router();
brand_route.use(express.static('public/Adminpublic'))



// brand_route.get("/addbrand", brandController.addBrand)
brand_route.post("/addbrand", brandController.addbrand)






module.exports = brand_route