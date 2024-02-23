const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    products: [{
        productId: String,
    }]
});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;