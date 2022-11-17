require('dotenv').config()
const User = require('../models/userSchema')
const Product = require('../models/productSchema')
const Cart = require('../models/cartSchema')
const mongoose = require('mongoose')
const userRoute=require('../controllers/userController')
// const cartRoute=require('../routes/cartRoute')

const addToCart = async (req, res) => {
   
    try {
        if (req.session.email) {
            const prodId = req.params.id
            const productId = new mongoose.Types.ObjectId(prodId)
            const email = req.session.email
            const user=await User.findOne({email})
            
            
            const id =user._id
            
            const item = await Product.findOne({ _id: productId })
            const price = item.product_price
            const detail = await User.findById({ _id: id })
            
            
            if (detail.state == true) {
                
                const userExist = await Cart.findOne({ id })
                
                console.log("try");
                if (userExist) {
                    const productExist = await Cart.findOne({
                        $and: [{ id }, {
                            cartItem: {
                                $elemMatch: {
                                    productId
                                }
                            }
                        }]
                    })
                  
                    if (productExist) {
                        
                        await Cart.findOneAndUpdate({ $and: [{ id }, { "cartItem.productId": productId }] }, { $inc: { "cartItem.$.quantity": 1 } })
                        
                        res.send({ success: true })
                        // res.redirect('/cart/userCart/:id')
                    } else {
                        
                        await Cart.updateOne({ id }, { $push: { cartItem: { productId, quantity: 1, price } } })
                        
                        res.send({ success: true })
                        // res.redirect('/cart/userCart/:id')
                    }
                } else {
                    const cart = new Cart({
                        id, cartItem: [{ productId, quantity: 1, price }]
                    })
                    await cart.save()
                    .then(() => {
                        res.send({ success: true })
                        // res.redirect('/cart/cart/:id')
                    })
                    .catch((err) => {
                        res.render('error', { err })
                    })
                    console.log('cart',cart);
                }

            } else {
                req.flash('error', 'You are unable to access the product')
                res.redirect('/shop')
            }
        } else {
            req.flash('error', 'You are not logged in')
            res.redirect('/shop')
        }
    } catch (err) {
        // res.render('error', { err })
        console.log('error');
    }``
}



const userCart = async (req, res) => {
 

    try {
        
        if (req.session.email) {
            console.log(req.session.email);
            const email = req.session.email
            const user=await User.find({email})
        
            const id=user[0]._id;
        
            const cartList = await Cart.aggregate([{ $match: { id } }, { $unwind: '$cartItem' },
            { $project: { item: '$cartItem.productId', itemQuantity: '$cartItem.quantity' } },
            { $lookup: {from:'products', localField: 'item', foreignField: '_id', as: 'product' } }]);
            
        
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
        } else {
            req.flash('error', 'you are not logged in')
            res.redirect('/')
        }
    } catch (err) {
        // res.render('error', { err })
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
        // console.log(detail);

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