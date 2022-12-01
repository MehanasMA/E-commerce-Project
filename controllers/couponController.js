const Coupon = require("../models/couponSchema");
const User = require('../models/userSchema')
const CheckoutData = require('../models/checkoutSchema')
const CartItem = require('../models/cartSchema')
const mongoose = require('mongoose')
const dateFormat = require("../utils/stringToDate")

const adminCouponPage = async (req, res) => {



    const coupons = await Coupon.find();


    res.render("coupon", { message: req.flash('message'), coupons });
}

//adding coupon 

const couponAdd = async (req, res) => {

    let { expDate, minAmount, couponCode, discountPercentage } = req.body;

    expDate = dateFormat.stringToDate(expDate, "yyyy-mm-dd", "-");


    let cop = await Coupon.findOne({ couponCode });

    // console.log("coop",cop);


    let add;
    let error = "";

    if (cop) {
        add = false;

        error = "cupon exites " + cop;
        req.flash('message', "coupen name is exits");

        res.redirect("/admin/coupon");





    } else {

        const coupon = new Coupon({ expDate, minAmount, couponCode, discountPercentage });
        try {
            await coupon.save();
            add = true;
            res.redirect("/admin/coupon");


        } catch (err) {
            console.log(err);

            req.flash('message', "something is worng");
            res.redirect("/admin/coupon");
            add = false

        }
    }



}


const couponDelete = async (req, res) => {
    console.log(req.body);
    let isDelete;
    const id = mongoose.Types.ObjectId(req.body.id);
    try {
        await Coupon.findByIdAndDelete(id)
        isDelete = true;

    } catch (err) {
        console.log(err);
        isDelete = false;

    }

    res.send({ isDelete })

}




const applyCoupen = async (req, res) => {

    console.log("yooo");


    try {
        const usercode = req.params.id
        console.log(usercode);
        const code = await Coupon.find({ couponCode: usercode })
        
        if (code) {
            if (code[0].expDate > Date.now()) {
                console.log("code", code);

                const email=req.session.email
                const users=await User.findOne({email})
                const userId = users._id
                console.log("userId", userId);
                const user = await CartItem.findOneAndUpdate({  id:userId }, { coupenCode: usercode })
                console.log("user", user);
                const discount = code[0]
                res.send({ success: discount })
                // console.log(discount);
                console.log(res.send);
            } else {
                console.log("expired", code);
                await Coupon.findOneAndDelete({ couponCode: usercode })
                req.flash('error', 'Invalid code')
                res.redirect('back')
            }
        } else {
            req.flash('error', 'Invalid code')
            res.redirect('back')
        }
    } catch (err) {
        // res.render('error',{err})
    }
}



module.exports = {
    adminCouponPage,
    couponAdd,
    couponDelete,
    applyCoupen,
}