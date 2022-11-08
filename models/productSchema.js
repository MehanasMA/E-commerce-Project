const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;



const productSchema = new Schema(
    {
        product_name: {
            type: String,
            unique: true,
            trim: true,
        },
        product_description: {
            type: String,
            trim: true
        },
        category_id: {
            type: ObjectId,
            trim: true

        },

        product_price: {
            type: String,
            trim: true
        },

        stock: {
            type: Number,
            trim: true
        },
        deleted: {
            type: Boolean,
            trim: true
        },


        image: [

            {
                url: String,
                filename: String,

            }
        ]

    },
    


    


);

productSchema.plugin(validator);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;