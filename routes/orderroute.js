const Order = require("../model/order");
const express = require('express');
const router = express.Router();

// Place Order
router.post('/place-order', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully', orderId: savedOrder._id });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Fetch Orders
router.get('/fetch-orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Remove Order
router.delete('/remove-order/:orderId', async (req, res) => {
    const { orderId } = req.params;
    try {
        const deletedOrder = await Order.findByIdAndRemove(orderId);
        if (deletedOrder) {
            res.status(200).json({ message: 'Order removed successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error removing order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
