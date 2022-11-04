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
    // confirmPassword: {
    //     type: String,
    //     required: true,
    //     trim: true,

    // },
    state: {
        type: Boolean,
        required: true,
        trim: true,
    },
});
userSchema.plugin(validator);
const User = mongoose.model("User", userSchema);
module.exports = User; 