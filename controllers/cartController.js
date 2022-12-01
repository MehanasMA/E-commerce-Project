require('dotenv').config()
const User = require('../models/userSchema')
const Product = require('../models/productSchema')
const Cart = require('../models/cartSchema')
const mongoose = require('mongoose')
const userRoute=require('../controllers/userController')
// const cartRoute=require('../routes/cartRoute')

// const addToCart = async (req, res) => {
   
//     try {
//         console.log("innnnnnnnn");
//         if (req.session.email) {
//             console.log("session",req.session.email);
//             const productId = req.params.id
//             console.log("jnjs",productId);
//             // const productId = new mongoose.Types.OdbjectId(prodId)
//             const email = req.session.email
//             console.log("emailllllll",email);
//             const user=await User.findOne({email})
//             console.log("userrrrrrrrrrrrrrr",user);
            
            
//             const id =user._id
//             console.log("id",id);
//             const item = await Product.findOne({ _id: productId })
//             const price = item.product_price
//             const detail = await User.findById({ _id: id })
            
//             if (detail.state == true) {
                
//                 const userExist = await Cart.findOne({ id })
                
//                 console.log("userExxxxxxxxxxxxxxxxxxxx",userExist);
//                 if (userExist) {
//                     const productExist = await Cart.findOne({
//                         $and: [{ id }, {
//                             cartItem: {
//                                 $elemMatch: {
//                                     productId
//                                 }
//                             }
//                         }]
//                     })
//                     console.log("productExxxxxxxxxx",productExist);
//                     if (productExist) {
                        
//                         await Cart.findOneAndUpdate({ $and: [{ id }, { "cartItem.productId": productId }] }, { $inc: { "cartItem.$.quantity": 1 } })
                        
//                         res.send({ success: true })
//                         // res.redirect('/cart/userCart/:id')
//                     } else {
                        
//                         await Cart.updateOne({ id }, { $push: { cartItem: { productId, quantity: 1, price } } })
                        
//                         res.send({ success: true })
//                         // res.redirect('/cart/userCart/:id')
//                     }
//                 } else {
//                     console.log("else");
//                     const cart = new Cart({
//                         id, cartItem: [{ productId, quantity: 1, price }]
//                     })
//                     console.log("detailllll",cart);
//                    const save= await cart.save()
//                     .then(() => {
//                         res.send({ success: true })
//                         // res.redirect('/cart/cart/:id')
//                     })
//                     .catch((err) => {
//                         res.render('error', { err })
//                     })
//                 console.log("producttttttttttttttttttt",save);
//                 }

//             } else {
//                 req.flash('error', 'You are unable to access the product')
//                 res.redirect('/shop')
//             }
//         } else {
//             req.flash('error', 'You are not logged in')
//             res.redirect('/shop')
//         }
//     } catch (err) {
//         // res.render('error', { err })
//         console.log('error');
//     }
// }

const addToCart = async (req, res) => {
    console.log("hgsad");
    const email = req.session.email
            console.log("emailllllll",email);
            const user=await User.findOne({email})
            console.log("userrrrrrrrrrrrrrr",user);
            
            
            const userId =user._id
            console.log("id",userId);
    const productId = req.params.id

    console.log("pprooooo", productId)

    try {

        if (req.session.email) {

            const userExist = await Cart.findOne({  userId })
            console.log("userexist", userExist);

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


                    console.log("Old product");
                }
                else {
                    await Cart.updateOne({ user: userId }, { $push: { cartItem: { productId: productId, quantity: 1 } } })

                    console.log("newwwww product");
                }

            } else {
                console.log("New User");
                const cart = new Cart({
                    id: userId, cartItem: [{ productId: productId, quantity: 1 }]
                })

                const prd=await cart.save()
                console.log("prdddddddddd",prd);


            }

        }
    } catch (err) {
        // res.render('error',{err})
    }
}

// const userCart = async (req, res) => {
 
//     try {
        
//         if (req.session.email) {
            
//             const email = req.session.email
//             const user=await User.find({email})
            
//             const id=user._id;
//             console.log("carrrrrrrrtttttttt",id);
        
//             const cartList = await Cart.aggregate([{ $match: { id } }, { $unwind: '$cartItem' },
//             { $project: { item: '$cartItem.productId', itemQuantity: '$cartItem.quantity' } },
//             { $lookup: {from:'products', localField: 'item', foreignField: '_id', as: 'product' } }]);
            
        
//             let total;
//             let subtotal = 0;

//             cartList.forEach((p) => {
//                 p.product.forEach((p2) => {
//                     total = (p2.product_price) * (p.itemQuantity)
//                     subtotal += total
//                 })
//             })
            
//             let shipping = 0;
//             if (subtotal < 15000) { 
            
//                 shipping = 150
//             } else {
//                 shipping = 0
                
//             }
//             const grandtotal = subtotal + shipping
//             console.log(grandtotal);
//             res.render('userpages/cartPage', { cartList, subtotal, total, shipping, grandtotal })
//         } else {
//             req.flash('error', 'you are not logged in')
//             res.redirect('/')
//         }
//     } catch (err) {
//         // res.render('error', { err })
//     }   
// }


const userCart = async (req, res) => {


    try {

        const email = req.session.email
        console.log("emailllllll", email);
        const user = await User.findOne({ email })
        console.log("userrrrrrrrrrrrrrr", user);


        const userId = user._id

        const cartList = await Cart.aggregate([{ $match: {  id:userId } }, { $unwind: '$cartItem' },
        { $project: { item: '$cartItem.productId', itemQuantity: '$cartItem.quantity' } },
        { $lookup: { from: 'products', localField: 'item', foreignField: '_id', as: 'product' } }
        ]);

console.log("carttttttllllllllllllllllllifyg",cartList);
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