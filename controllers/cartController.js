require('dotenv').config()
const User = require('../models/userSchema')
const Product = require('../models/productSchema')
const Cart = require('../models/cartSchema')
const mongoose = require('mongoose')
const userRoute = require('../controllers/userController')


const addToCart = async (req, res) => {
    
    const email = req.session.email

    const user = await User.findOne({ email })
    


    const userId = user._id
    console.log("id", userId);
    const productId = req.params.id


    try {

        if (req.session.email) {

            const userExist = await Cart.findOne({ id:userId })

            if (userExist) {
                const productExist = await Cart.findOne({
                    $and: [{ id: userId }, {
                        cartItem: {
                            $elemMatch: {
                                productId: productId
                            }
                        }
                    }]
                })
                if (productExist) {

                    await Cart.findOneAndUpdate({
                        $and: [{ id: userId }, {
                            cartItem: {
                                $elemMatch: {
                                    productId: productId
                                }
                            }
                        }]
                    }, { $inc: { "cartItem.$.quantity": 1 } })


                }
                else {
                    await Cart.updateOne({ user: userId }, { $push: { cartItem: { productId: productId, quantity: 1 } } })

                }

            } else {
                const cart = new Cart({
                    id: userId, cartItem: [{ productId: productId, quantity: 1 }]
                })

                const prd = await cart.save()


            }

        }
    } catch (err) {
        res.render('error', { err })
    }
}



const userCart = async (req, res) => {


    try {

        const email = req.session.email
        const user = await User.findOne({ email })


        const userId = user._id
        console.log(userId)
        const cartList = await Cart.aggregate([{ $match: {  id:userId } }, { $unwind: '$cartItem' },
        { $project: { item: '$cartItem.productId', itemQuantity: '$cartItem.quantity' } },
        { $lookup: { from: 'products', localField: 'item', foreignField: '_id', as: 'product' } }
        ]);


        
        let total;
        let subtotal = 0;

        cartList.forEach((p) => {
            p.product.forEach((p2) => {
                total = (p2.product_price) * (p.itemQuantity)
                subtotal += total
            })
        })


        let shipping = 0;
        if (subtotal < 15000) {

            shipping = 150
        } else {
            shipping = 0

        }
        const grandtotal = subtotal + shipping

        res.render('userpages/cartPage', { cartList, subtotal, total, shipping, grandtotal })


    } catch (err) {

        // res.render('error', { err })
    }
}



const itemInc = async (req, res) => {

    try {

        const prodId = req.params

        const productId = mongoose.Types.ObjectId(prodId)
        const email = req.session.email
        const user = await User.find({ email })

        const userId = user[0]._id;

        const detail = await User.findById({ _id: userId })
       

        if (detail.state == true) {
            const userExist = await Cart.findOne({ userId })

            if (userExist) {

                const productExist = await Cart.findOne({
                    $and: [{ userId }, {
                        cartItems: {
                            $elemMatch: {
                                productId
                            }
                        }
                    }]
                })

                if (productExist) {
                    await Cart.findOneAndUpdate({ $and: [{ userId }, { "cartItem.productId": productId }] }, { $inc: { "cartItem.$.quantity": 1 } })

                    let quantity = 0
                    // req.flash('success', 'Item added to cart successfully')
                    res.send({ success: true })
                    // res.redirect('/product/shop')
                } else {
                    // req.flash('error', 'Unable to add item!!!')
                    res.redirect('back')
                }
            } else {
                req.flash('error', 'You are not logged in')
            }
        } else {
            // req.flash('error', 'You are unable to access the product')
            res.redirect('back')
        }

    } catch (err) {
        // res.render('error', { err })
    }
}




const itemDec = async (req, res) => {
    try {
        const prodId = req.params.id
        const productId = new mongoose.Types.ObjectId(prodId)
        const email = req.session.email
        const user = await User.find({ email })

        const userId = user[0]._id;
        const detail = await User.findById({ _id: userId })

        if (detail.state == true) {
            const userExist = await Cart.findOne({ userId })

            if (userExist) {
                const productExist = await Cart.findOne({
                    $and: [{ userId }, {
                        cartItems: {
                            $elemMatch: {
                                productId
                            }
                        }
                    }]
                })

                if (productExist) {
                    await Cart.findOneAndUpdate({ $and: [{ userId }, { "cartItem.productId": productId }] }, { $inc: { "cartItem.$.quantity": -1 } })
                    req.flash('success', 'Item removed from cart successfully')
                    res.send({ success: true })
                    // res.redirect('/cart/cart')
                } else {
                    req.flash('error', 'Unable to delete item!!!')
                    res.redirect('back')
                }
            } else {
                req.flash('error', 'You are not logged in')
            }
        } else {
            req.flash('error', 'You are unable to access the product')
            res.redirect('back')
        }
    } catch (err) {
        res.render('error', { err })
    }
}
const itemDelete = async (req, res) => {
    try {
        const prodId = req.params.id
        const productId = new mongoose.Types.ObjectId(prodId)
        const email = req.session.email
        const user = await User.find({ email })

        const id = user[0]._id;
        const detail = await User.findById({ _id: id })

        if (detail.state == true) {
            await Cart.updateOne({ id }, { $pull: { cartItem: { "productId": productId } } })
            res.send({ success: true })
        } else {
            req.flash('error', 'You are unable to access the product')
            res.redirect('back')
        }

    } catch (err) {
        res.render('error', { err })
    }
}



module.exports = {
    addToCart,
    itemInc,
    itemDec,
    itemDelete,
    userCart,
}