// const { findByIdAndUpdate } = require('../models/userModel');
const bcrypt = require("bcryptjs");

const Admin = require("../models/adminSchema");
const flash = require("connect-flash")
const session = require("express-session");
const filestore = require("session-file-store")(session);
const Category = require("../models/categorySchema");
const Product = require("../models/productSchema");
const checkoutData = require("../models/checkoutSchema")
const { Store } = require("express-session");
const User = require("../models/userSchema");
const Brand = require("../models/brandSchema");






const addadmin = (req, res) => {
    res.render("Adminlogin");
}


// const adminhome = (req, res) => {
//     res.render("dashboard")
// }





const adminhome = async (req, res) => {
      
// const admin={username:"admin@gmail.com",password:"admin123"}
// const {username,password}=req.body
// if(username==admin.username && password==admin.password){
    try {
        const dailySale = await checkoutData.find({ $and: [{ createdAt: { $lt: Date.now(), $gt: Date.now() - 86400000 } }, { 'orderStatus.type': { $ne: 'Cancelled' } }] })
        let todaySale = 0
        dailySale.forEach((s) => {
            todaySale += s.bill
        })
        let totalSale = 0


        const sale = await checkoutData.find({ 'orderStatus.type': { $ne: 'Cancelled' } })
        sale.forEach((s) => {
            totalSale += s.bill
        })
        todayRevenue = todaySale * 10 / 100
        totalRevenue = totalSale * 10 / 100
        const completed = await checkoutData.find({ isCompleted: true }).sort({ createdAt: -1 }).limit(10)
        const graph = await checkoutData.aggregate(
            [
                {
                    $group: {
                        _id: { month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, year: { $year: "$createdAt" } },
                        totalPrice: { $sum: '$bill' },
                        count: { $sum: 1 }

                    }

                }, { $sort: { _id: -1 } },
                { $project: { totalPrice: 1, _id: 0 } }, { $limit: 7 }
            ]
        );

        let values = [];
        let revenue = []
        graph.forEach((g) => {
            values.push(g.totalPrice)
            revenue.push(g.totalPrice * 10 / 100)
        })

        const ordered = await checkoutData.find({ 'orderStatus.type': 'Ordered' }).count()
        const packed = await checkoutData.find({ 'orderStatus.type': 'Packed' }).count()
        const shipped = await checkoutData.find({ 'orderStatus.type': 'Shipped' }).count()
        const delivered = await checkoutData.find({ 'orderStatus.type': 'Delivered' }).count()
        const cancelled = await checkoutData.find({ 'orderStatus.type': 'Cancelled' }).count()


        res.render('dashboard', { todaySale, totalSale, todaySale, totalRevenue, completed, values, revenue, ordered, packed, shipped, delivered, cancelled })
    } catch (err) {
        res.render('error')
    }
}
// }



const categoryBrand=async(req,res)=>{
    console.log("bnm");
    const categorys = await Category.find({});
    const brand=await Brand.find({})
    res.render('category-brand',{categorys,brand})
}



const productOrders = async (req, res) => {
   
    try {
        
        const orderData = await checkoutData.find({}).sort({ 'orderStatus.date': -1 })
        console.log(orderData);
        // orderId = mongoose.Types.ObjectId(orderData._Id)
        // console.log(orderId);
        res.render('orderManagment', { orderData })
    } catch (err) {
        res.render('error', { err })
    }
}

const orderItems = async (req, res) => {
    try {
        const cartId = req.body
        const email=req.session.email
        console.log("hellooo",email);
        const user=await User.findOne({email})
        const userId=user._id
        // const cartId = mongoose.Types.ObjectId(carId)
        console.log(cartId);
        const cartList = await checkoutData.aggregate([{ $match: {userId } }, { $unwind: '$cartItems' },
        { $project: { item: '$cartItems.productId', itemQuantity: '$cartItems.quantity' } },
        { $lookup: { from: 'products', localField: 'item' , foreignField: '_id', as: 'product' } }
    ]);
                console.log("cartlist*****",cartList);
        res.send({ cartList })
    } catch (err) {
        res.render('error', { err })
    }
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






const editOrder = async (req, res) => {
    try {
        const { id } = req.params
        const orderData = await checkoutData.findById(id)
        const email=req.session.email
        const user=await User.findOne({email})
        res.render('editOrder', { orderData,user })
    } catch (err) {
        res.render('error', { err })
    }
}


const updateOrder = async (req, res) => {
    try {
        const { id } = req.params
        await checkoutData.findByIdAndUpdate(id, {

            orderStatus: {
                type: req.body.orderStatus,
                date: req.body.date

            }
        })
        const orderData = await checkoutData.findById(id)
        if (orderData.orderStatus[0].type == 'Delivered' && orderData.paymentStatus == 'cod') {
            await checkoutData.findByIdAndUpdate(id, {
                isCompleted: true
            })
        } else {
            await checkoutData.findOneAndUpdate({ $and: [{ _id: id }, { paymentStatus: 'cod' }] }, {
                isCompleted: false
            })
        }
        req.flash('success', 'Order updated Successfully')
        res.redirect('/orders')
    } catch (err) {
        res.render('error', { err })
    }
}



const logout = (req, res) => {
    try {
        console.log("logouting");
        req.session.destroy()
        res.redirect("/admin/adminlogin");
    } catch (error) {
        console.log(error.message)

    }


}



module.exports = {
    addadmin, addadminpost, editOrder,adminhome, userManageget, editUser, logout, updateOrder, orderItems, productOrders,categoryBrand }
