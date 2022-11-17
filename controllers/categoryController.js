const Category = require("../models/categorySchema");
const flash = require("connect-flash")
// const session = require("express-session");
// const filestore = require("session-file-store")(session);
const Product = require("../models/productSchema")
const Admin = require("../models/adminSchema");


const addCategory = async (req, res) => {
    const { category } = req.body;

    const newCategory = new Category({
        category,
    });
    try {
        await newCategory.save();
    } catch (error) {
        req.flash("msg", "Category already exists");

        // res.sendStatus(404);
    }
    res.redirect("/product/products");
};


const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findByIdAndDelete(id)

        res.redirect("/product/products");

    } catch (err) {
        console.log(err);
    }

}



module.exports = { addCategory,deleteCategory }




















// const categories = async (req, res) => {
//     const categories = await Category.find({});
//     res.render('admin/categorys', { message: req.flash('exists'), categories });
// }

// const categoryPost = async (req, res) => {
//     const { category } = req.body;

//     const newCategory = new Category({
//         category
//     })
//     try {
//         await newCategory.save()

//     } catch (error) {
//         req.flash('exists', 'category already exists');
//     }
//     res.redirect('/categories');

// }


// exports.categories = categories;
// exports.categoryPost = categoryPost;