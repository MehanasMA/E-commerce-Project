
const sessionCheck = (req, res, next) => {
    if (req.session.email) {
        res.redirect('/')
    } else {
        next()
    }
}

const sessionCheckHomePage = (req, res, next) => {
    if (req.session.email) {
        next();
    }
    else {
        res.redirect('/')
        next()
    }
}

const sessionCheckCart=(req,res,next)=>{
    if(req.session.email){
        next()
    }
    else{
        res.redirect('/shop')
    }
}

const adminSessionCheck = (req, res, next) => {
    if (req.session.admin) {
        res.redirect('/adminHome')
    } else {
        next()
    }
}

const adminSessionCheckHomePage = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        res.redirect('/adminLogin')
        next()
    }
}

module.exports = {
    sessionCheck,
    sessionCheckCart,
    sessionCheckHomePage,
    adminSessionCheck,
    adminSessionCheckHomePage
} 
