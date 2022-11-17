const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const nodemailer = require('nodemailer')
const Admin = require('../models/adminSchema')
const Product=require('../models/productSchema')
const flash = require('connect-flash')
const cartItems=require('../models/cartSchema')
const cartController=require('./cartController')





let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: "Gmail",

    auth: {
        user: 'mamehanas88.gmail.com',
        pass: 'mnyxapkyfetljzon'
    },
});
const otp = `${Math.floor(1000 + Math.random() * 9000)}`;


const home = async(req, res) => {
    // try{
    //     let cartItem
    //     let cartCount
    // console.log(req.session.email);
        const email=req.session.email
        const user=await User.find({email})
        // const id=user[0]._id
        
        // console.log(id);
        // if(req.session.user){
            // cartItem= await cartController.findOne({id})
            // console.log('item',cartItem);
            // cartCount = await Cart.aggregate([{ $match: { id } }, { $project: { count: { $size: "$cartItem" } } }, { $project: { _id: 0 } }]);
            res.render("userpages/home", { message: req.flash("invalid"),user});

        // }
// }catch{}
}


const loginPost = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        req.session.email = user.email;
        // req.session.user_type = user.user_type;
        // req.session.user_id = user._id;

        res.redirect('/')
    }
    else {
        req.flash('invalid', 'invalid username or password');
    }

}


// const signupPageGet = (req, res) => {

//     res.render("userpages/signup");
// };


// const signupPost = async (req, res) => {
//     console.log(req.body)
//     try {
//         const user = new User({
//             name: req.body.name,
//             mobile: req.body.mobile,
//             email: req.body.email,
//             password: req.body.password,
//             confirmPassword: req.body.confirmPassword,

//             is_admin: 0

//         })
//         const userData = await user.save()
//         res.redirect("/home")


//     } catch (error) {
//         console.log(error.message)
//         res.status(500).send(error)
//     }

// }






const myaccount = (req, res) => {
    res.render("userpages/myaccount")
}

const category = (req, res) => {
    res.render("userpages/category")
}

const shop = async(req, res) => {
    const user = req.session.email
    const product=await Product.find()
    // console.log(product);
    res.render('userpages/shop',{user,product})
}

const blog = (req, res) => {
    res.render('userpages/blog')
}

const about = (req, res) => {
    res.render('userpages/about')
}

const contact = (req, res) => {
    res.render('userpages/contact')
}


const wishlist = (req, res) => {
    res.render('userpages/wishlist')
}




const logout = (req, res) => {
    try {
        req.session.destroy()
        res.redirect("/");
    } catch (error) {
        console.log(error.message)

    }


}





const signupPost = async (req, res) => {
    const { name, mobile, email, password, state, } = req.body;

    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        name,
        mobile,
        email,
        password: hash,
        state: false,
    })
    console.log(req.body);
    req.session.useremail = req.body.email



    const mailOptions = {
        from: "mamehanas88@gmail.com",
        to: req.body.email,
        subject: "Otp for registration is: ",
        html: `<h3>Enter OTP to varify your email address and complete signup process</h3><h1>${otp}</h1>`, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.render("userpages/otp", { msg: "" });
    });
    console.log(otp);

    try {
        await user.save();
        res.redirect('/otpget')

    } catch (error) {
        console.log(error);
        res.redirect("/");
    }



};

const otpget = (req, res) => {
    res.render('userpages/otp')
}



const verify = async (req, res) => {
    const email = req.session.useremail;
    console.log(req.body.otp);
    if (otp == req.body.otp) {

        
    
        await User.updateOne({ email: email }, { state: true });
        res.redirect("/");

    } else {
        res.redirect("/otpget");
    }
};



const checkout=(req,res)=>{
    res.render('userpages/checkoutpage')
}




exports.home = home;
// exports.signup = signup;
exports.myaccount = myaccount;
exports.category = category
exports.shop = shop
exports.blog = blog
exports.otpget = otpget
exports.verify = verify
exports.about = about
exports.checkout = checkout
exports.wishlist = wishlist
exports.contact = contact
exports.loginPost = loginPost;
exports.signupPost = signupPost;
exports.logout = logout;
