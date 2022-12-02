const express = require('express');
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });



const productController = require("../controllers/productController");
const product_route = express.Router();

product_route.use(express.static('public/Adminpublic'))




product_route.get("/products", productController.products);


product_route
    .route("/addProduct")
    .get(productController.addproduct)
    .post(upload.array("image"), productController.addProduct)

product_route.get("/product", productController.products)


product_route.get("/editproduct/:id", productController.editproduct)

product_route.post("/editProduct/:id" ,productController.editProduct)

// product_route.get("/showProduct", productController.showProduct)

product_route.put("/deleteProduct/:id", productController.deleteProduct)

product_route.get('/productDetails/:id', productController.viewProductDetails)



module.exports = product_route
