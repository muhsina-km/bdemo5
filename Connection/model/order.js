const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    email: String,
    name: String, 
    phone: String,      
    address: String,
    place: String,
    district: String, 
    payment: String,
    items: [{
        productId: String,
        quantity: Number,
    }],       
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;