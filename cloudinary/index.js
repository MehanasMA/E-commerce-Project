const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
    cloud_name: 'dzeddutlz',
    api_key: 682817395839412,
    api_secret: 'ToXPLE3mUg1mt1DA8CfnlEE9brw',
});
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "E-COMMERCE PROJECT",
        allowedFormats: ["jpeg", "png", "jpg"],
    },
});
module.exports = {
    cloudinary,
    storage,
};