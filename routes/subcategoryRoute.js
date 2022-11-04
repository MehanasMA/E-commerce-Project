const mongoose = require('mongoose');
const validator = require("mongoose-unique-validator");
const Category = require('./categorySchema');

const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const subCategorySchema = new Schema({
    subcategory: {
        type: String,
        required: true,
        trim: true
    },
    category_id: ObjectId

})
subCategorySchema.plugin(validator);
const Subcategory = mongoose.model('Subcategory', subCategorySchema);
module.exports = Subcategory;
