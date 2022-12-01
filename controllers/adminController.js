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






const addadmin = (req, res) => {
    res.render("Adminlogin", { message: req.flash("invalid") });
}


// const adminhome = (req, res) => {
//     res.render("dashboard")
// }





const adminhome = async (req, res) => {
      


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





const productOrders = async (req, res) => {
   
    try {
        
        const orderData = await checkoutData.find({}).sort({ 'orderStatus.date': -1 })
        console.log(orderData);
        // orderId = mongoose.Types.ObjectId(orderData._Id)
        // console.log(orderId);
        res.render('orderManagment', { orderData })
    } catch (err) {
        // res.render('error', { err })
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
        // res.render('error', { err })
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



module.exports = { addadmin, addadminpost, adminhome, account, userManageget, editUser, logout, updateOrder, orderItems, productOrders }
