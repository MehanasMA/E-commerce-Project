const Category = require("../models/categorySchema");
const flash = require("connect-flash")
const Product = require("../models/productSchema")
const Admin = require("../models/adminSchema");
const Brand = require('../models/brandSchema')
// const filestore = require("session-file-store")(session);
// const session = require("express-session");





// const addBrand = async (req, res) => {
//     const brand = await Brand.find({})
//     res.render("admintemplate/addbrand", { brand })
// }




const addbrand = async (req, res) => {
    const { brand } = req.body;

    const newBrand = new Brand({
        brand,
    });
    try {
        await newBrand.save();
    } catch (error) {
        req.flash("msg", "Brand already exists");

        // res.sendStatus(404);
    }
    res.redirect("/admin/categoryBrand");
};




module.exports = { addbrand }