const Cart = require('../model/cart')
const app = require('express').Router()

// API endpoint to save items to the cart
app.post('/add-to-cart', async (req, res) => {
    const { email, productId, quantity } = req.body;
  
    try {
      let cart = await Cart.findOne({ email });
  
      if (!cart) {
        cart = new Cart({ email, items: [] });
      }
  
      // Check if the product is already in the cart
      const existingItem = cart.items.find((item) => item.productId === productId);
  
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
  
      await cart.save();
      res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = app