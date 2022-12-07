const mongoose = require('mongoose')

const checkoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cartItems: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    address: [{
       
            type: String,
            required: true,
            trim: true
    }],
    paymentStatus: {
        type: String,
        enum: ["cod", "online"],
        required: true
    },
    bill: {
        type: Number,
        required: true
    },
    coupenCode: {
        type: String
    },
    orderStatus: [{
        type: {
            type: String,
            enum: ["Ordered", "Packed", "Shipped", "Delivered", "Cancelled"],
            default: "Ordered"
        },
        date: {
            type: Date,
            default: Date.now()
        },
    }],
    isCompleted: {
        type: Boolean,
        default: false
    },
    expectedDate: {
        type: Date,
        default: () => new Date(+ new Date() + 7 * 24 * 60 * 1000)
    }
}, { timestamps: true })

module.exports = mongoose.model("Checkout", checkoutSchema)