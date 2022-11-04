const express = require('express');


const categoryController = require("../controllers/categoryController");
const category_route = express.Router();

category_route.use(express.static('public/Adminpublic'))



// category_route.get("/addcategory", categoryController.addcategory)

category_route.post("/addcategory", categoryController.addCategory)

module.exports = category_route 