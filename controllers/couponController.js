const applyCoupen = async (req, res) => {

    console.log("yooo");


    try {
        const usercode = req.params.id
        console.log(usercode);
        const code = await Coupon.find({ couponCode: usercode })
        console.log(code);
        if (code) {
            console.log("code", code);
            if (code[0].expDate > Date.now()) {

                console.log("usercode", code);
                const userId = req.session.userId
                console.log("userId", userId);
                const user = await CheckoutData.findOneAndUpdate({ user: userId }, { coupenCode: usercode })
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
        res.render('error',{err})
    }
}



module.exports = {
    // adminCouponPage,
    // couponAdd,
    // couponDelete,
    applyCoupen,
}