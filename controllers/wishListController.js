require('dotenv').config()
const User = require('../models/userSchema')
const Wishlist = require('../models/wishListSchema')
const Product=require('../models/productSchema')

const mongoose = require('mongoose')

const addToWishlist = async (req, res) => {
    try {
        if (req.session.email) {
            // console.log(req.session.email);
            const prodId = req.params.id
            const productId = new mongoose.Types.ObjectId(prodId)
            const email = req.session.email
            const user = await User.find({ email })

            const userId = user[0]._id;
            const detail = await User.findById({ _id: userId })
            if (detail.state == true) {
                const userExist = await Wishlist.findOne({ userId })
                if (userExist) {
                    const productExist = await Wishlist.findOne({
                        $and: [{ userId }, {
                            wishlistItems: {
                                $elemMatch: {
                                    productId
                                }
                            }
                        }]
                    })
                    if (productExist) {
                        res.send({ success: false })
                    } else {
                        await Wishlist.updateOne({ userId }, { $push: { wishlistItems: { productId } } })
                        res.send({ success: true })
                    }
                } else {
                    const wishlist = new Wishlist({
                        userId, wishlistItems: [{ productId }]
                    })
                    await wishlist.save()
                        .then(() => {
                            res.send({ success: true })
                        })
                        .catch((err) => {
                            // res.render('error', { err })
                        })
                }
            } else {
                req.flash('error', 'You are unable to access the product')
                res.redirect('back')
            }
        } else {
            req.flash('error', 'You are not logged in')
            res.redirect('back')
        }
    } catch (err) {
        // res.render('error', { err })
    }
}

const userWishlist = async (req, res) => {
    
    try {
        const email = req.session.email
        const user = await User.find({ email })
        
        const userId = user[0]._id;
    console.log(userId);
        // const  prodId  = req.params.id
        // console.log(prodId);
        // const productId = new mongoose.Types.ObjectId(prodId)
        
        const wishlistProducts = await Wishlist.aggregate([{ $match: { userId } }, { $unwind: '$wishlistItems' },
        { $project: { item: '$wishlistItems.productId' } },
        { $lookup: { from: 'products', localField: 'item', foreignField: '_id', as: 'product' } }
    ]);
        console.log("ghjk");
        console.log(wishlistProducts[0]);
        res.render('userpages/wishlist', { wishlistProducts,user })
    } catch (err) {
        // res.render('error', { err })
    }
}

const deleteWishlist = async (req, res) => {
    try {
        console.log("delete");
        const productId = req.params.id
        console.log("prdid@@@@@@@@@",productId);
        // const productId = new mongoose.Types.ObjectId(prodId)
            
        const email = req.session.email
        const user = await User.find({ email })

        const userId = user[0]._id;
        console.log(userId);

        
        const detail = await User.findById({ _id: userId })
        if (detail.state== true) {
            await Wishlist.updateOne({ userId }, { $pull: { wishlistItems: { "productId": productId } } })
            res.send({ success: true })
        } else {
            req.flash('error', 'You are unable to access the product')
            res.send({ success: false })
        }
    } catch (err) {
        // res.render('error', { err })
    }
}

module.exports = {
    addToWishlist,
    userWishlist,
    deleteWishlist
}