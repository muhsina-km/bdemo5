const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    email: String,
    name: String, 
    phone: String,      
    address: String,
    place: String,
    district: String, 
    payment: String,
    orderDate: { type: Date, default: Date.now },
    status: {
        type: String,
        default: "ORDERING"
    },
    items: [{
        productId: String,
        quantity: Number,
        price: Number,
        plantname: String,
        plantphoto: String
    }],       
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;