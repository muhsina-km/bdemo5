const express = require('express');
const router = express.Router();
const Order = require('../model/order');

// Place Order
router.post('/place-order', async (req, res) => {
  const { userId, products } = req.body;

  try {
    const order = new Order({ userId, products });
    await order.save();

    // Send confirmation email/notification to user and admin if needed

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;