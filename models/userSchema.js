const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
        trim: true,

    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
 
    state: {
        type: Boolean,
        required: true,
        trim: true,
    },
    useraddress:[{
        name: {
            type: String,
            required: true,
           
            trim: true,
        },
        mobile: {
            type: Number,
            required: true,
           
            trim: true,
        },
        address:{
            type: String,
            required: true,
            trim: true,
        },
        district: {
            type: String,
            required: true,
            
            trim: true,
        },
        statePlace: {
            type: String,
            required: true,
            
            trim: true,

        },

        pincode: {
            type: String,
            required: true,
            trim: true,
        },
 } ]
                                  
});
userSchema.plugin(validator);
const User = mongoose.model("User", userSchema);
module.exports = User; 