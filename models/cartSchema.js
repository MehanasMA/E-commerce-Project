const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cartItem: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },

            price:{
              type:Number,

            },
            quantity: {
                type: Number,
                required: true
            },
        }
    ],
    coupenCode: {
        type: String
    }
})

module.exports = mongoose.model('CartItem', cartSchema)