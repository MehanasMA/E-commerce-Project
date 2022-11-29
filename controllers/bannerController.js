const bannerData = require('../models/bannerSchema')



const  setBanner = async (req, res) => {
    
    try {
        console.log("banner");
        const banners = await bannerData.find({})
        res.render('admintemplate/banners', { banners })
    } catch (err) {
        res.render('error', { err })
    }
}

const addBanner = async (req, res) => {
    try {
        res.render('admintemplate/addBanner')
    } catch (err) {
        res.render('error', { err })
    }
}

const saveBanner = async (req, res) => {
    console.log("asdnsajdnjs");
    try {
        const banner = new bannerData({
            highlight: req.body.highlight,
            description: req.body.description,
            date: Date.now()
            
        })
        console.log("data",banner);
        banner.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
        await banner.save()
        console.log("after",banner);
        req.flash("success", 'Banner added successfully')
        res.redirect('back')
    } catch (err) {
        res.render('error', { err })
    }
}

module.exports = {
    setBanner,
    addBanner,
    saveBanner
 }