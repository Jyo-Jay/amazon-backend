const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true, min: [1, 'Quantity cannot be less than 1.'] }
    });

const orderSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        items: [itemSchema]
    });

module.exports = mongoose.model('Order', orderSchema);
