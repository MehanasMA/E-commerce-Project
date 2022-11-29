const Admin = require("../models/adminSchema");
const flash = require("connect-flash")
const session = require("express-session");
const filestore = require("session-file-store")(session);
const Category = require("../models/categorySchema");
const Product = require("../models/productSchema")
const Brand = require('../models/brandSchema');
const category = require("./userController");
const {cloudinary}=require('../cloudinary')
const { aggregate } = require("../models/productSchema");
// const Subcategory = require("../models/subCategorySchema");
const mongoose = require('mongoose');
const multer = require('multer');
const User = require("../models/userSchema");
const upload = multer({ cloudinary });


const showproduct = ""


const products = async (req, res) => {

    const categorys = await Category.find({});
    const product = await Product.find({})
    // console.log(product);
    res.render("admintemplate/products", { categorys, product, data: showproduct })
    // showproduct = await Product.find({})


}



const productManageget=async(req,res)=>{
    res.render('admintemplate/productManagment')
    

}

// const showProduct = async (req, res) => {
//     showproduct = await Product.find()
//     res.redirect('/product/products')
// }


const editproduct = async (req, res) => {
   
    const { id } = req.params
   console.log(id);
    const datas = await Product.findById(id)
    const categories = await Category.find({})
    
    console.log(datas);
    const productId = datas._id
    const category_id = datas._id

 
    const categorylook = await Product.aggregate([
        {
            $match: {
                _id: productId,
            },
        },
        {
            $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category",
            },
        },
    ]);
    //  console.log(categorylook);
    // console.log(categorylook[0].category[0]);

    const categoryFind = await Category.find({});

   
    res.render('admintemplate/editproduct', { datas, categorylook,categoryFind, categories })

}

const editProduct = async (req, res) => {
    const { id } = req.params
    // console.log('edited')
    const edit = req.body
    await Product.findByIdAndUpdate(id, { $set: edit })
    res.redirect('/product/product')

}




const addproduct = async (req, res) => {
    const categorys = await Category.find({});

    res.render("admintemplate/addProduct", { categorys })
    // console.log(categorys);

}



const addProduct = async (req, res) => {

    const { product, description, categoryid, price,stock} = req.body;
    
    const newProduct = new Product({
        product_name: product,
        product_description: description,
        category_id: categoryid,
        product_price: price,
        stock:stock,
        
        
        
    });
     newProduct.image = req.files.map((f)=> ({ url: f.path, filename: f.filename }));
    // console.log("categoryid", categoryid);

    try {
        await newProduct.save();
        console.log(newProduct);

    



    } catch (error) {
        // console.log("dfghj");
        req.flash("msg", "product already exists");

        // res.sendStatus(404);
    }
    res.redirect("/product/products");
};


// const deleteProduct = async (req, res) => {
//     const productId = req.params._id;
//     // console.log(userId);
//     try {
//         // await Product.findByIdAndDelete(productId);
//         await Product.findByIdAndUpdate(productId, { deleted: true })
//         res.redirect("/product/products");
//     } catch (error) { }
// };


const deleteProduct = async (req, res) => {
    // console.log("dadd");
    try {
        const { id } = req.params
        // console.log(id);
        const product = await Product.findByIdAndDelete(id)
        // console.log(product)

        res.redirect('/product/products')
    } catch (err) {
        console.log(err)
    }
}


const viewProductDetails = async (req, res) => {
    const email=req.session.email
    const user=await User.findOne({email})
    try {
        const { id } = req.params
        const details = await Product.findById(id)
        res.render('userpages/productDetails', { details ,user})
    } catch (err) {
        res.render('error', { err })
    }

}



module.exports = { products, addproduct, addProduct, editproduct, editProduct, deleteProduct, productManageget, viewProductDetails }