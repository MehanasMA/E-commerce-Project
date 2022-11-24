const bcrypt = require('bcryptjs')
const Razorpay = require('razorpay')

function hashPassword(password) {
    const salt = bcrypt.genSaltSync()
    return bcrypt.hashSync(password, salt)
}

function comparePassword(raw, hash) {
    return bcrypt.compareSync(raw, hash)
}

function hashOTP(OTP) {
    const salt = bcrypt.genSaltSync()
    return bcrypt.hashSync(OTP, salt)
}

function compareOTP(raw, hash) {
    return bcrypt.compareSync(raw, hash)
}

const instance = new Razorpay({
    key_id: 'rzp_test_oUvkyEUOA6xs5U',
    key_secret: '2ybL5wm4EfClD7PyCsHJg7Cr'
})

function generateRazorpay(orderId, bill) {
    return new Promise((resolve, reject) => {
        const options = {
            amount: bill * 100,
            currency: "INR",
            receipt: `${orderId}`
        };
        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log(err)
            } else {
                console.log(order)
                resolve(order)
            }
        })
    })

}

function verifyPayment(details) {
    return new Promise((resolve, reject) => {
        const crypto = require('crypto')
        let hmac = crypto.createHmac('sha256', '2ybL5wm4EfClD7PyCsHJg7Cr')
        hmac.update(details.payment.razorpay_order_id + '|' + details.payment.razorpay_payment_id, '2ybL5wm4EfClD7PyCsHJg7Cr')
        hmac = hmac.digest('hex')
        if (hmac == details.payment.razorpay_signature) {
            resolve()
        } else {
            reject()
        }
    })
}

module.exports = {
    hashPassword,
    comparePassword,
    hashOTP,
    compareOTP,
    generateRazorpay,
    verifyPayment
} 