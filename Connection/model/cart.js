const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    email: String,
    items: [{
        productId: String,
        quantity: Number,
    }],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;