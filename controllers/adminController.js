// const { findByIdAndUpdate } = require('../models/userModel');
const bcrypt = require("bcryptjs");

const Admin = require("../models/adminSchema");
const flash = require("connect-flash")
const session = require("express-session");
const filestore = require("session-file-store")(session);
const Category = require("../models/categorySchema");
const Product = require("../models/productSchema");
const { Store } = require("express-session");
const User = require("../models/userSchema");






const addadmin = (req, res) => {
    res.render("Adminlogin", { message: req.flash("invalid") });
}


const adminhome = (req, res) => {
    res.render("dashboard")
}


const account = (req, res) => {
    res.render("accounts")
}




const addadminpost = async (req, res) => {


    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (admin) {

        const validPassword = await bcrypt.compare(password, admin.password);

        if (validPassword) {
            req.session.username = admin.username;
            res.redirect("/admin/dashboard");
        } else {
            req.flash("invalid", "invalid password");
            res.redirect("/admin/adminlogin")
        }
    } else {
        req.flash("invalid", "invalid username");
        res.redirect("/admin/adminlogin");
    }
};



const userManageget = async (req, res) => {
    const showuser = await User.find({}).sort({ name: 1 })
    res.render('userManagment', { showuser })
}

// const userStateblock = async (req, res) => {
//     const { id } = req.params;
//     await User.findByIdAndUpdate(id, { state: false });
//     res.redirect("/admin/userManageget");
// };
// const userStateUnblock = async (req, res) => {
//     const { id } = req.params;
//     await User.findByIdAndUpdate(id, { state: true });
//     res.redirect("/admin/userManageget");
// };



const editUser = async (req, res) => {
    console.log("ffgh");
    try {
        const { id } = req.params
        console.log(id);

        const datas = await User.findById(id)

        if (datas.state == true) {
            await User.findByIdAndUpdate(id, { state: false })
            res.redirect('/admin/userManageget')
        } else {
            await User.findByIdAndUpdate(id, { state: true })
            res.redirect('/admin/userManageget')
        }
    } catch (err) {
        console.log(err)
    }
}



// const editproductget = (req, res) => {
//     res.render('admintemplate/editproduct')
// }


// const editproductpost = (req, res) => {
//     res.redirect('/admin/editproduct')
// }



const logout = (req, res) => {
    try {
        req.session.destroy()
        res.redirect("/admin/adminlogin");
    } catch (error) {
        console.log(error.message)

    }


}



module.exports = { addadmin, addadminpost, adminhome, account, userManageget, editUser, logout }
