const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const nodemailer = require('nodemailer')
const Admin = require('../models/adminSchema')
const Product=require('../models/productSchema')
const flash = require('connect-flash')
const cartItems=require('../models/cartSchema')
const cartController=require('./cartController')
const checkoutData=require('../models/checkoutSchema')
const wishlistData=require('../models/wishListSchema')
const categoryData=require('../models/categorySchema')
const bannerData=require('../models/bannerSchema');
const Category = require("../models/categorySchema");




let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: "Gmail",

    auth: {
        user: 'mamehanas88@gmail.com',
        pass: 'wtfuokqbkhcgqgsm'
    },
});
const otp = `${Math.floor(1000 + Math.random() * 9000)}`;



const home = async (req, res) => {
    const email = req.session.email
        const user=await User.find({email})
    try {
        let cartCount;
        let wishlistCount
        let cartItems;
        let wishlistItems
        let orderData
        let user
        if (req.session.user) {
            const userId = req.session.user._id
            orderData = await checkoutData.find({ userId: userId })
            cartItems = await cartItems.findOne({ userId })
            wishlistItems = await wishlistData.findOne({ userId })
            cartCount = await cartItems.aggregate([{ $match: { userId } }, { $project: { count: { $size: "$cartItem" } } }, { $project: { _id: 0 } }]);
            wishlistCount = await wishlistData.aggregate([{ $match: { userId } }, { $project: { count: { $size: "$wishlistItems" } } }, { $project: { _id: 0 } }]);
        }
        const products = await Product.find({}).limit(4)
        // console.log(products);
        const categories = await categoryData.find({})
        const banner = await bannerData.find({}).sort({ date: -1 })
        // const justArrived = await Product.find({
        //     $and: [{
        //         expiresAt: { $gte: Date.now() }
        //     }, { deleted: false }]
        // }).limit(4)
        res.render('userpages/home', { products, categories, cartCount, wishlistCount, cartItems, wishlistItems, orderData, banner,user })
    } catch (err) {
        res.render('error', { err })
    }
}












const loginPost = async (req, res, next) => {
    const { Email, password } = req.body;
    const user = await User.findOne({ Email });
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);
    if (validPassword) {
        req.session.email = user.email;
       

        res.redirect('/')
    }
    else {
        req.flash('invalid', 'invalid username or password');
    }

}




const myaccount = async(req, res) => {
    try{
    // const user=await User.find({})
    const email = req.session.email
    const user = await User.findOne({ email })
    const userId = user._id
    // const user = await User.findById(userId)
    const useraddress = user.useraddress
    const orderData = await checkoutData.find({ userId, paymentStatus: { $in: ["done", "COD"] } }).limit(4)
    // console.log("address",user.useraddress);
    res.render("userpages/myaccount",{user,useraddress,orderData})
    }catch{
        res.render('error')
    }
}

const category = (req, res) => {
    res.render("userpages/category")
}

const shop = async(req, res) => {
    try{
    const user = req.session.email
    const product=await Product.find()
    const newCategory=await Category.find({})
 
    res.render('userpages/shop', { user, product, newCategory })
    }catch{
        res.render('error')
    }
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

const addAddress = async (req, res) => {

    const email=req.session.email
   
    const user=await User.findOne({email})
    // console.log(user);
    try {
        res.render('userpages/addaddress',{user})
    } catch (err) {
        res.render('error', { err })
    }
}


const saveAddress = async (req, res) => {
    
    try {
        const { id } = req.params
        if (!req.body) {
            req.flash('error', 'Empty fields are not allowed')
            res.redirect('back')
        }
        else {
            
            const {name,email,mobile,address,district,statePlace,pincode} =req.body
            
            try{
                console.log(req.body);
                
               const tryyy= await User.findByIdAndUpdate(id, { $push: { useraddress:{name, email, mobile, address, district, statePlace, pincode } }})
               console.log(tryyy);
             
                res.redirect('/checkout/checkout/:id')

            }
            
            
            catch(err){
               
                console.log("update failed");
            }
        }
    } catch (err) {
        res.render('error', { err })
    }

}




const catagorySort = async (req, res) => {

    const catagoryId = req.body.catagoryId;
console.log(catagoryId);
    const product = await Product.find({ category_id: catagoryId })
    console.log("ffff", product);

    res.send({ product });

}

// const deleteAddress = async (req, res) => {
//     try {
//         const { id } = req.params
//         console.log("delete",id);
//         const deletion = await User.findOneAndDelete({ id })
//         deletion.remove()
//         console.log("deleted",deletion);
//         res.send({ success: true })
//     } catch (err) {
//         res.render('error', { err })
//     }
// }




const logout = (req, res) => {
    try {
        req.session.destroy()
        console.log("logout");
        res.redirect("/");
    } catch (error) {
        console.log(error.message)

    }


}





const signupPost = async (req, res) => {
    const { name,mobile,email,password,confirmpassword,state } = req.body;
  console.log(req.body);
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



// const checkout=(req,res)=>{
//     res.render('userpages/checkoutpage')
// }




exports.home = home;
exports.catagorySort = catagorySort
exports.myaccount = myaccount;
exports.category = category
exports.shop = shop
exports.blog = blog
exports.otpget = otpget
exports.verify = verify
exports.about = about
// exports.deleteAddress = deleteAddress
exports.addAddress=addAddress
exports.saveAddress=saveAddress
exports.contact = contact
exports.loginPost = loginPost;
exports.signupPost = signupPost;
exports.logout = logout;
