const Admin = require("../models/adminSchema");
const flash = require("connect-flash")
const session = require("express-session");
const filestore = require("session-file-store")(session);
const Category = require("../models/categorySchema");
const Product = require("../models/productSchema")
const Brand = require('../models/brandSchema');
const category = require("./userController");



const showproduct = ""


const products = async (req, res) => {

    const categorys = await Category.find({});
    const product = await Product.find({})
    // console.log(product);
    res.render("admintemplate/products", { categorys, product, data: showproduct })
    // showproduct = await Product.find({})


}


const showProduct = async (req, res) => {
    showproduct = await Product.find()
    res.redirect('/product/products')
}


const editproduct = async (req, res) => {
    console.log("dfghj");
    const { id } = req.params
    console.log(id);
    const datas = await Product.findById(id)
    const categories = await Category.find({})
    console.log(datas);

    const productId = datas._id
    const category_id = datas._id

    console.log(productId);
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
    console.log(category_id);
    // console.log(categorylook.category[0]);

    // const categoryFind = await Category.find({});

    // console.log(categoryFind)
    res.render('admintemplate/editproduct', { datas, categorylook ,categories})

}

const editProduct = async (req, res) => {
    const { id } = req.params
    console.log('edited')
    const edit = req.body
    await Product.findByIdAndUpdate(id, { $set: edit })
    res.redirect('/product/product')

}




const addproduct = async (req, res) => {
    const categorys = await Category.find({});

    res.render("admintemplate/addProduct", { categorys })
    console.log(categorys);

}



const addProduct = async (req, res) => {

    const { product, description, categoryid, price } = req.body;
    console.log(req.body);

    const newProduct = new Product({
        product_name: product,
        product_description: description,
        category_id: categoryid,
        product_price: price,
    });
console.log("categoryid" ,categoryid);
    try {
        await newProduct.save();
        console.log(newProduct);



    } catch (error) {
        console.log("dfghj");
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
    console.log("dadd");
    try {
        const { id } = req.params
        console.log(id);
        const product = await Product.findByIdAndDelete(id)
        console.log(product)

        res.redirect('/product/products')
    } catch (err) {
        console.log(err)
    }
}


module.exports = { products, addproduct, addProduct, editproduct, editProduct, showProduct, deleteProduct }