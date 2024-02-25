const Cart = require('../model/cart')
const app = require('express').Router()
const express = require('express');
const plantdetailsmodel = require('../model/plant');


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


//FIND TOTAL
app.get('/calculate-total-price', async (req, res) => {
  const { email } = req.query;
  try {
    const cart = await Cart.findOne({ email });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }

    let totalPrice = 0;
    for (const item of cart.items) {
      const product = await plantdetailsmodel.findOne({ plantid: item.productId });
      if (product) {
        totalPrice += product.price * item.quantity;
      }
    }

    res.status(200).json({ totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//VIEW CART
app.get('/view-cart', async (req, res) => {
  const { email } = req.query; // Access email from query parameters instead of body

  try {
      const cart = await Cart.findOne({ email });
      if (!cart) {
          return res.status(404).json({ message: 'Cart not found for this user' });
      }

      // Extracting productIds from the cart
      const productIds = cart.items.map(item => item.productId);

      // Fetching details of products from the Plant collection
      const products = await plantdetailsmodel.find({ plantid: { $in: productIds } });

      // Merging cart items with product details
      const mergedCart = cart.items.map(item => {
          const product = products.find(product => product.plantid === item.productId);
          return {
              productId: item.productId,
              quantity: item.quantity,
              ...product.toObject() // Merge product details into the cart item
          };
      });

      res.status(200).json({ cart: mergedCart });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


//remove an item from the cart
app.post('/remove-from-cart', async (req, res) => {
  const { email, productId } = req.body;
    console.log('Received request to remove item from cart:', {email, productId});
  try {
    const cart = await Cart.findOne({ email });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }

    // Filter out the item to be removed
    cart.items = cart.items.filter(item => item.productId !== productId);

    await cart.save();

    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = app