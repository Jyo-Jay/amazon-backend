const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    cartItems:[{
        product:[{type: mongoose.Schema.Types.ObjectId, ref:'Product'}],
        productQuantity:{type:Number, required:true}
    }]
});

module.exports = mongoose.model('Cart', cartSchema);
