const Cart = require("../model/cart");
const Order = require("../model/order");
const express = require('express');
const plantdetailsmodel = require("../model/plant");
const router = express.Router();

// Place Order
router.post('/place-order', async (req, res) => {
    const { email } = req.body;
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        await Cart.findOneAndDelete({ email });
        res.status(201).json({ message: 'Order placed successfully', orderId: savedOrder._id });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Order Status
// router.patch('/update-order-status/:orderId', async (req, res) => {
//     const { orderId } = req.params;
//     const { status } = req.body; // Expecting status in the request body

//     try {
//         const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
//         if (updatedOrder) {
//             res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
//         } else {
//             res.status(404).json({ message: 'Order not found' });
//         }
//     } catch (error) {
//         console.error('Error updating order status:', error);
//         res.status(500).json({ error: 'Internal server error', details: error.message });
//     }
// });

router.patch('/update-order-status/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body; // Expecting status in the request body

    try {
        // Update order status
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        
        if (updatedOrder) {
            // Retrieve items from the updated order
            const { items } = updatedOrder;

            // Iterate over each item and update stock
            for (const item of items) {
                const product = await plantdetailsmodel.findOne({ plantid: item.productId });
                if (product) {
                    // Subtract ordered quantity from stock
                    const newStock = product.stock - item.quantity;
                    // Update stock of the product
                    await plantdetailsmodel.findOneAndUpdate({ plantid: item.productId }, { stock: newStock });
                }
            }

            res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Fetch Orders admin
// Fetch Orders
router.get('/fetch-orders/admin', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch Orders
router.get('/fetch-orders', async (req, res) => {
    try {
        const userEmail = req.query.email;
        if (!userEmail) {
            return res.status(400).json({ error: 'Email is missing' });
        }
        const orders = await Order.find({ email: userEmail });
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
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (deletedOrder) {
            res.status(200).json({ message: 'Order removed successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error removing order:', error);
        res.status(500).json({ error: 'Internal server error', details:error.message });
    }
});

module.exports = router;
