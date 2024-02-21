const Cart = require('../model/cart')
const app = require('express').Router()
const express = require('express');


app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
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

  app.get('/view-cart', async (req, res) => {
    const { email } = req.query; // Access email from query parameters instead of body
  
    try {
        const cart = await Cart.findOne({ email });
  
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }
  
        res.status(200).json({ cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = app