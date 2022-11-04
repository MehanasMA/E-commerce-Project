const express = require('express');


const productController = require("../controllers/productController");
const product_route = express.Router();

product_route.use(express.static('public/Adminpublic'))




product_route.get("/products", productController.products);


product_route.get("/addproduct", productController.addproduct)

product_route.post("/addProduct", productController.addProduct)


product_route.get("/editproduct/:id", productController.editproduct)

product_route.post("/editProduct/:id", productController.editProduct)

product_route.get("/showProduct", productController.showProduct)

product_route.put("/deleteProduct/:id", productController.deleteProduct)



module.exports = product_route
