const mongoose = require('mongoose');
//const bcrypt = require ('bcrypt');

const productSchema = new mongoose.Schema({
    productName:{ type:String, required: true },
    productType:{ type: String, required: true},
    productPrice: { type: Number, required: true },
    productImage: {
        data: Buffer,
        contentType: String
    },
    productDesc: { type: String, required: true },
    rating: { type: Number, required: true}
},
{
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);