

const express = require('express')
const mongoose = require("mongoose")
const app = express()
const path = require("path");
const cookieParser = require("cookie-parser");
const adminRoute = require('./routes/adminRoute')
const userRoute = require('./routes/userRoute')
const categoryRoute = require('./routes/categoryRoute')
const brandRoute = require('./routes/brandRoute')
const cartRoute = require('./routes/cartRoute')
const wishListRoute = require('./routes/wishListRoute')
const productRoute = require('./routes/productRoute')
const checkOutRoute = require('./routes/checkoutRoute')
const bannerRoute=require('./routes/bannerRoute')
const session = require("express-session");
const multer=require('multer')
const morgan=require('morgan')
// const filestore = require("session-file-store")(session);
const flash = require("connect-flash")
const methodOverride = require('method-override')
const cors = require('cors')
const MongoDBStore = require('connect-mongodb-session')(session)
const bodyParser = require('body-parser')
// const multer=require('multer')
// const upload = multer({ cloudinary });


app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json())
app.use(methodOverride('_method'))

app.set("view engine", "ejs");
app.use(flash())
app.use(cors());
app.use(morgan('dev'));

app.use(cookieParser());


const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/victoria?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4',
    collection: "sessionValue",
})

store.on("error", function (error) {
    console.log(error);
})

app.use(
    session({
        secret: "Secret",
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7
        },
        store: store,
        saveUninitialized: false,
        resave: false,
    })
);

app.use(function (req, res, next) {
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
});

app.use('/admin', adminRoute)
app.use('/', userRoute)
app.use('/category', categoryRoute)
app.use('/brand', brandRoute)
app.use('/banner',bannerRoute)
app.use('/cart', cartRoute)
app.use('/product', productRoute)
app.use('/wishlist',wishListRoute)
app.use('/checkout', checkOutRoute)
app.get("*", (req, res) => {
    res.render("./userpages/error.ejs")
})








mongoose.connect('mongodb://127.0.0.1:27017/victoria?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4').then(() => {
    app.listen(3000, () => { console.log("Server is running") })
})
    .catch((err) => {
        console.log('there is error')
        console.error(err)
    })







